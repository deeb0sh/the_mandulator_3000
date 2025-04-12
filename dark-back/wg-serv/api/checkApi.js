import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import getNetwork from '../utils/getNetwork.js' // генерируем все сети для пользователя
import getUserNetwork from '../utils/getUserNetwork.js' // смотри все сети занетый пользователями

export default async function wgCheckApi(fastify) {

    fastify.register(jwt, { // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.get('/wg/check', {
        schema: {
                headers: headersJwtValid // валидация хедеров один JWT
            }
        },
        async (request, reply) => {
            try {
                const decod = await request.jwtVerify() //первое валидация токена их хедера
                const user = decod.user // извлекаем логин , дальше будим искать его в таблице пользователей вг
                const role = decod.role // извлекаем роль
                const userCheck = await fastify.prisma.Users.findFirst({ // ищем сопадения имеён в бд если нет то создаём пользвателя
                    where: {
                        login: user
                    },
                    select: {
                        id: true,
                        //role: true
                    }
                })
                if (!userCheck) { // если пользователя нет в бд то создаём его и даём доступ ко всем серверам
                    const newUser = await fastify.prisma.users.create({
                        data: {
                            login: user,
                            roleId: role
                        },
                    })
                    // узнаём есть ли подсети у пользователя
                    const userSubnets = await fastify.prisma.userSubnet.findMany({
                        where: {
                          userId: newUser.id,  // ID пользователя
                        },
                        select: {
                            serverName: true,
                            network: true
                        }
                    })
                    // если сетей у пользователя нет то начинаем вычеслять и заполнять их
                    if (userSubnets.length === 0) {
                        const allNetRu = await getNetwork(fastify,user,'RU')
                        const allNetDe = await getNetwork(fastify,user,'DE')
                        const allNetFi = await getNetwork(fastify,user,'FI')

                        const userNetRu = (await getUserNetwork(fastify, 'RU')).map(n => n.network);
                        const userNetDe = (await getUserNetwork(fastify, 'DE')).map(n => n.network);
                        const userNetFi = (await getUserNetwork(fastify, 'FI')).map(n => n.network);

                        const freeNetRu = allNetRu.filter(subnet => !userNetRu.includes(subnet))
                        const freeNetDe = allNetDe.filter(subnet => !userNetDe.includes(subnet))
                        const freeNetFi = allNetFi.filter(subnet => !userNetFi.includes(subnet))                       
                        if (freeNetRu.length > 0 || freeNetDe.length > 0 || freeNetFi.length > 0) {
                            await fastify.prisma.userSubnet.createMany({
                                data: [
                                  { userId: newUser.id, serverName: 'RU', network: freeNetRu[0]},
                                  { userId: newUser.id, serverName: 'DE', network: freeNetDe[0]},
                                  { userId: newUser.id, serverName: 'FI', network: freeNetFi[0] }
                                ],
                                skipDuplicates: true
                              });
                        } 
                        else  {
                            fastify.log.error("нет свободный сетей");
                            return reply.send({ message: "invalid" , onErr: "Нет свободных сетей" })
                        }
                    fastify.log.info("✅ сети назначены ");
                    }
                }
                // промеряем роль . если роль поменялась то меняем на мандуляторе
                const curentRole = await fastify.prisma.users.findFirst({
                    where: { login: user },
                    select: { roleId: true, }
                })
                if (curentRole.roleId !== role ) {
                    await fastify.prisma.users.update({
                        where: { login: user },
                        data: { roleId: role }
                    })
                }              
                // список всеха клиентов пользователя  (((((( ТОЛЬКО ТУТ ))))))))
                const allClinet = await fastify.prisma.users.findMany({
                    where: {
                        id: userCheck.id
                    },
                    select:{
                        clients: {
                                select: {
                                //id: true,
                                name: true,
                                ip: true,
                                serverName: true
                            }
                        }
                    }
                })

                if (!allClinet.length || allClinet[0].clients.length === 0) {
                    return reply.send({ message: "valid"});
                }

                return reply.send({ message: "valid", allClinet })
            }
            catch (e) {
                //return reply.redirect('/')
                return reply.send({ message: "invalid", onErr: "Ошибка на сервера" })
            }
        }
    )
}