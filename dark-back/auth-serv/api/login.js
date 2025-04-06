import { verifyPasswd } from '../utils/hashPasswd.js'
import { loginValid } from '../schemas/loginvalid.js'
import { headersValid } from '../schemas/headersvalid.js'
import jwt from '@fastify/jwt'

export default async function loginApi(fastify) {
    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })
    // валидация токена + поиск сессии
    fastify.get('/auth/login', {
        schema: {
            headers: headersValid // валидация хедеров
        }
    }, 
    async(request, reply) => {
        const token = request.headers.authorization.replace('Bearer ', '') // выпилваем из токена bearer
        const fprint = request.headers['x-fingerprint'] // выпиливаем fingerprint
        if (!token) {
            fastify.log.warn('Попытка входа без токена')
            return reply.send({ message: "invalid" })
        }
        try {
            fastify.log.info('Проверка токена...')
            const decod = await request.jwtVerify() // request.jwtVerify() берёт токен автоматический из хедера authorization 
            const sessionValid = await fastify.prisma.session.findFirst({ // ищем сессию
                where: {
                    token: token,
                    fingerPrint: fprint
                },
                select: {
                    id: true
                }
            })
            if ( sessionValid === null ) { // проверяем сессию (токен + отпечаток) ( фпизду перезапимсываение токена )
                fastify.log.warn('Невалидная сессия')
                return reply.send({ "message": "invalid" })
            } 
            const user = decod.user
            fastify.log.info(`Пользователь ${user} вошёл `)
            return reply.status(200).send({ message: "valid" }) // отправляем ответ , имя пользователя , новый токен, роль и инвайты
        }
        catch(err) {
            fastify.log.error(`Ошибка проверки токена: ${err.message}`)
            return reply.send({ message: "invalid" })
        }
    })

    // логинизация 
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
                salt: true,
                roleID: true,
                id: true
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
        await fastify.prisma.users.update({ // обвноляем информации о последнем в ходе 
            where: {
                login: user
            },
            data:{
                lastLoginAt: new Date(),
                updatedAt: new Date()
            }
        })
        const role = checkUser.roleID
        const token = fastify.jwt.sign({ user, role, expiresIn: '24h'}) // генерируем токет 24 часа ттл + роль передаём в токене
        const expTime = new Date()
        expTime.setHours(expTime.getHours() + 24)
        await fastify.prisma.session.create({ // создаём запись о сессии
            data:{
                ownerID: checkUser.id , // user.id 
                token: token,
                exp: expTime, // дата протухания 
                userIp: userIp,
                userAgent: userAgent,
                fingerPrint: fingerprint
            }
        })
        //reply.header('set-cookie',`token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`)
        fastify.log.info(`Пользователь ${user} успешно вошел`)
        return reply.status(200).send({ message: 'valid', token })
    })
}
