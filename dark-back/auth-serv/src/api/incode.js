import { incodeValid } from "../schemas/incodeValid.js"
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import jwt from '@fastify/jwt'

export default async function incodeApi(fastify) {
    
    fastify.register(jwt,{ // регистарция jwt плагина
            secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.get('/auth/incode', { 
        schema: {
                headers: headersJwtValid // валидация хедеров один JWT
            }
        },
        async(request, reply) => {
            try {
                const decod = await request.jwtVerify() // валидация JWT если не валидный то возарвщаем ошибку
                const user = decod.user
                const getID = await fastify.prisma.users.findFirst ({
                    where: {
                        login: user
                    },
                    select: {
                        id: true
                    }
                })
                const uuid = getID.id
                const getCode = await fastify.prisma.inviteList.findFirst({
                    where: {
                        authorID: uuid,
                        active: true
                    },
                    select: {
                        code: true
                    }
                })
                if (getCode) {
                    const code = getCode.code
                    return reply.send({ inCode: code})
                }
                return reply.send({ inCode: "null"})
            }
            catch (e) {
                return { message: `invalid ${e}` }
            }
        })

    fastify.post('/auth/incode',{
        schema: {
               body: incodeValid, // схема валидации тело POST
               headers: headersJwtValid // валидация хедерА auth
            }
        },
        async(request, reply) => {
            const { incode }  = request.body
            try {
                const decod = await request.jwtVerify() // валидация JWT если не валидный то возарвщаем ошибку
                const user = decod.user
                const getID = await fastify.prisma.users.findFirst ({
                    where: {
                        login: user
                    },
                    select: {
                        id: true
                    }
                })
                const uuid = getID.id
                await fastify.prisma.inviteList.create({
                    data: {
                        authorID: uuid,
                        code: incode
                    }
                })
                return reply.send({ incode: incode })
            }
            catch(err) {
                fastify.log.warn('Невалидный токен')
                return reply.send({ message: `invalid ${err}` })
            }
        }
    )
}