import { incodeValid } from "../schemas/incodeValid.js"
import { headersValid } from "../schemas/headersvalid.js"
import jwt from '@fastify/jwt'

export default async function incodeApi(fastify) {
    
    fastify.register(jwt,{ // регистарция jwt плагина
            secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.get('/auth/incode', async (request, reply) => {
        return { message: 'invalid' };
    })

    fastify.post('/auth/incode',{
        schema: {
               body: incodeValid, // схема валидации
               headers: headersValid // валидация хедеров
            }
        },
        async(request, reply) => {
            const { incode, role }  = request.body
            try {
                const decod = await request.jwtVerify() // валидация JWT
                const user = decod.user

                const token = request.headers.authorization.replace('Bearer ', '') // выпилваем из токена bearer
                const fprint = request.headers['x-fingerprint'] // выпиливаем fingerprint
                
                const sessionValid = await fastify.prisma.session.findFirst({ // ищем сессию в бд
                    where: {
                        token: token,
                        fingerPrint: fprint
                    },
                    select: {
                        ownerID: true
                    }
                })

                const roleValid = await fastify.prisma.users.findFirst({ // если id есть тогда роль соответствует логину
                    where: {
                        login: user,
                        roleID: Number(role)
                    },
                    select:{
                        id: true
                    }
                })

                if ( sessionValid === null || roleValid === null ) { // проверяем сессию и результат login|role
                    fastify.log.warn('Невалидная сессия')
                    return reply.send({ "message": "invalid" })
                } 
                
                const uuid = sessionValid.ownerID // UUID пользователя

                await fastify.prisma.inviteList.create({
                    data: {
                        authorID: uuid,
                        code: incode
                    }
                })

                return reply.send({ message: "ok!" })
            }
            catch(err) {
                return reply.send({ message: `error ${err}` })
            }
        }
    )
}