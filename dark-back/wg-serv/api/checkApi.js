import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { Netmask } from 'netmask'

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
                        
                        // узнаём из бд подсеть пользователя
                        // узнаём подсети серверов
                        // вычесляем свобдные подсети и назначаем их пользоватеою
                      
                        await fastify.prisma.users.create({
                            data: {
                              login: user,
                              roleId: role
                            },
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