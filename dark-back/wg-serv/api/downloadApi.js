import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { wgid } from '../schemas/wgid.js'


export default async function downloadApi(fastify) {
    fastify.register(jwt, { // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.post('/wg/download', {
        schema: {
                headers: headersJwtValid, // валидация хедеров один JWT
                body: wgid // валидация тела запрпса
            }
        },
        async (request, reply) => {
            try{
                const decod = await request.jwtVerify() //первое валидация токена их хедера
                const user = decod.user // логин на мандуляторе
                const { id } = request.body // забераем id из тема после валидаций
                // узнаём id учётки на мандуляторе (логина)
                const login = await fastify.prisma.users.findFirst({ 
                    where: {
                        login: user
                    },
                    select: {
                        id: true
                    }
                })
                const loginId = login.id
                // проверяс есть принадлезнасть клиента к пользователю
                // const checkClient = await fastify.prisma.client.findFirst({ 
                //     where: {
                //         userId: Number(loginId),
                //         id: Number(id)
                //     },
                //     select: {
                //         name: true
                //     }
                // })
                // // если попытка подмены тогда инвалид
                // if (!checkClient) {
                //     return reply.send({ message: "invalid", onErr: "запрещено, Клиент не пренадлежит пользователю"})
                // }

                // собираем конфиг клиента wg и отпрвляем пользователю
                const client = await fastify.prisma.client.findFirst({
                    where: {
                        id: Number(id),
                        userId: Number(loginId)
                    },
                    select : {
                        name: true,
                        ip: true,
                        // publicKey: true,
                        privateKey: true,
                        endPoint: true,
                        allowIps: true,
                        dns: true,
                        server: {
                             select: {
                                 publicKey: true,
                                 port: true
                            }
                        }
                    }
                })

                const config = `
# darksurf.ru Мандулятор v2.0

[Interface]
PrivateKey = ${client.privateKey}
Address = ${client.ip}
DNS = ${client.dns}

[Peer]
PublicKey = ${client.server.publicKey}
AllowedIPs = ${client.allowIps}
Endpoint = ${client.endPoint}:${client.server.port}
`.trim() // trim удаляет пустое место с начала и конца файла
            reply
                .header('Content-Type', 'application/octet-stream')
                .header('Content-Disposition', `attachment; filename="${client.name}.conf"`)
                .send(config);
                return reply.send({ message: "valid", config})
            }
            catch (e) {
                return reply.send({ message: "invalid", onErr: e})
            }
        })
}