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

        const checkPasswd = await verifyPasswd(password, checkUser.password , checkUser.salt)
        
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
        const token = fastify.jwt.sign({ user, expiresIn: '48h'})
        return reply.status(200).send({ 
            message: 'ok!', 
            token: `${token}` 
        })
    })
}
