import { verifyPasswd } from '../utils/hashPasswd.js'
import { loginValid } from '../schemas/loginvalid.js'
import jwt from '@fastify/jwt'

export default async function loginApi(fastify) {
    fastify.register(jwt,{ // регистарция jwt плагина
        secret: 'SuperSecretYopta' // секрет пометсить в бд или env
    })

    fastify.post('/auth/login',{
        schema: {
            body: loginValid  // валидация 
        }
    }, 
    async (request, reply) => {
        const { user, password } = request.body
        const userAgent = request.headers['user-agent'] // user-agent пользователя      
        const userIp = request.ip // ip пользователя
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
            return reply.status(400).send({ message: "пользователь не найден" })
        }

        const checkPasswd =  await verifyPasswd(password, checkUser.password , checkUser.salt)
        
        if (!checkPasswd) {
            return reply.status(400).send({ message: "пароль не верный" })
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
        
        const userID = await fastify.prisma.users.findUnique({ // извлекаем id пользователя 
            where: {
                login: user
            },
            select:{
                id: true
            }
        })

        // const checkUA = await fastify.prisma.session.findFirst({
        //     where: {
        //         ownerID: userID.id,
        //         userIp: userIp,
        //         userAgent: userAgent
        //     },
        //     select: {
        //         id: true
        //     }
        // })

        // if (checkUA) {
        //     await fastify.prisma.session.delete({
        //         where: {
        //             id: checkUA.id
        //         }
        //     })
        // } 
        
        await fastify.prisma.session.create({ // создаём запись о сессии
            data:{
                ownerID: userID.id , // user.id 
                token: token,
                userIp: userIp,
                userAgent: userAgent
            }
        })
        
        return reply.status(200).send({ // возвращаем пользователю токен
            message: 'ok!',
            token: `${token}` 
        })
    })
}
