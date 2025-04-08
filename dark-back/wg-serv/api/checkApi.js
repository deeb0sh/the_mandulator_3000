import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'

export default async function wgCreateApi(fastify) {

    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })
    
        fastify.get('/wg/check', {
                schema: {
                   headers: headersJwtValid // валидация хедеров один JWT
                }
            }, 
            async(request, reply) => {
                try {
                    const decod = await request.jwtVerify() //первое валидация токена их хедера
                    const user = decod.user // извлекаем логин , дальше будим искать его в таблице пользователей вг
                    const role = decod.role // извлекаем роль
                    const userCheck = await fastify.prisma.Users.findFirst({ // ищем сопадения имеён в бд если нет то создаём пользвателя
                        where: {
                            login: user
                        },
                        select: {
                            role: true
                        }
                    })
                    if (!userCheck) { // если пользователя нет в бд то создаём его и даём доступ ко всем серверам
                        await fastify.prisma.users.create({
                            data: {
                              login: user,
                              role: {
                                connect: { id: role } // подключаем к роли в базе
                              },
                              access: { 
                                create: [
                                  { serverType: 'RU', allowed: true },
                                  { serverType: 'DE', allowed: true },
                                  { serverType: 'FI', allowed: true }
                                ]
                              }
                            },
                            include: { access: true }
                          })
                    }
                return reply.send({ message: "valid" })
                }
                catch (e) {
                    //return reply.redirect('/')
                    return reply.send({ message: `invalid --- ${e}` })
                }
            }
        )
}