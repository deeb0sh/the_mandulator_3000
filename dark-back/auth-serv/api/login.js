import { verifyPasswd } from '../utils/hashPasswd.js'
import { loginValid } from '../schemas/loginvalid.js'
import { headersValid } from '../schemas/headersvalid.js'
import jwt from '@fastify/jwt'

export default async function loginApi(fastify) {
    
    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    // валидация токена
    fastify.get('/auth/login', {
        schema: {
            headers: headersValid // валидация хедеров
        }
    }, 
    async(request, reply) => {
        const token = request.headers.authorization.replace('Bearer ', '') // выпилваем из токена bearer
        const fprint = request.headers['x-fingerprint']

        if (!token) {
            fastify.log.warn('Попытка входа без токена')
            return reply.send({ message: "invalid" })
        }

        try {
            fastify.log.info('Проверка токена...')
            const decod = await request.jwtVerify() // request.jwtVerify() берёт токен автоматический из хедера authorization 
            const sessionValid = await fastify.prisma.session.findFirst({
                where: {
                    token: token,
                    fingerPrint: fprint
                },
                select: {
                    id: true
                }
            })
            if ( sessionValid === null ) {
                fastify.log.warn('Невалидная сессия')
                return reply.send({ "message": "invalid" })
            } 

            const user = decod.user
            const expTime = new Date()
            expTime.setHours(expTime.getHours() + 24)
            const tokenNew = fastify.jwt.sign({ user, expiresIn: '24h'})
            //console.log(user, expTime, sessionValid.id)

            await fastify.prisma.session.update({ // если всё отлично, то перевыпускаем токен и записываем (предотвратили протузание токена во время работы пользователя)
                where: {
                     id: sessionValid.id
                },
                data: {
                    updateAt: new Date(),
                    token: tokenNew,
                    exp: expTime
                }
            })

            fastify.log.info(`Пользователь ${user} успешно обновил токен`)
            return reply.status(200).send({ message: "valid" , user, tokenNew })
        }
        catch(err) {
            fastify.log.error(`Ошибка проверки токена: ${err.message}`)
            return reply.send({ message: "invalid" })
        }
    })

    // логинизация :D
    fastify.post('/auth/login',{ 
        schema: {
            body: loginValid  // валидация 
        }
    }, 
    async (request, reply) => {
        const { user, password, fingerprint } = request.body
        //console.log(fingerprint)
        const userAgent = request.headers['user-agent'] // user-agent пользователя      
        const userIp = request.ip // ip пользователя

        fastify.log.info(`Попытка входа: ${user} с IP ${userIp}`)

        const checkUser = await fastify.prisma.users.findUnique({
            where: {
                login: user
            },
            select: {
                password: true,
                salt: true
            }
        })

        if (!checkUser) {
            fastify.log.warn(`Пользователь ${user} не найден`)
            return reply.send({ message: "пользователь не найден" })
        }

        const checkPasswd = await verifyPasswd(password, checkUser.password , checkUser.salt)
        
        if (!checkPasswd) {
            fastify.log.warn(`Неверный пароль для пользователя ${user}`)
            return reply.send({ message: "пароль не верный" })
        }

        await fastify.prisma.users.update({
            where: {
                login: user
            },
            data:{
                lastLoginAt: new Date(),
                updatedAt: new Date()
            }
        })

        const token = fastify.jwt.sign({ user, expiresIn: '24h'}) // генерируем токет 24 часа ттл
        const expTime = new Date()
        expTime.setHours(expTime.getHours() + 24)

        const userID = await fastify.prisma.users.findUnique({ // извлекаем id пользователя 
            where: {
                login: user
            },
            select:{
                id: true
            }
        })
              
        await fastify.prisma.session.create({ // создаём запись о сессии
            data:{
                ownerID: userID.id , // user.id 
                token: token,
                exp: expTime, // дата протухания 
                userIp: userIp,
                userAgent: userAgent,
                fingerPrint: fingerprint
            }
        })
        
        //reply.header('set-cookie',`token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`)
        fastify.log.info(`Пользователь ${user} успешно вошел`)
        return reply.status(200).send({ // возвращаем пользователю токен
            message: 'ok!',
            token: token
        })
    })
}
