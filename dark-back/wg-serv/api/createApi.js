import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { wgNameValid } from '../schemas/wgNameValid.js'
import { wgid } from '../schemas/wgid.js'
import syncwg from '../utils/syncwg.js'
import defIp from '../utils/defaultIp.js'
import crypto from 'crypto'


export default async function wgCreateApi(fastify) {
    fastify.register(jwt, { // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.post('/wg/create', {
        schema: {
                headers: headersJwtValid, // валидация хедеров один JWT
                body: wgNameValid // валидация тела запрпса
            }
        },
        async (request, reply) => {
            try {
                const decod = await request.jwtVerify() //первое валидация токена их хедера
                const user = decod.user // логин на мандуляторе
                // const role = decod.role // роль на мандуляторе
                const { wguser, location } = request.body // имя впн-пользователя и локаицмя
                const currentUser = await fastify.prisma.users.findFirst({
                    where: { 
                           login: user
                    },
                    select: { 
                        id: true,
                        subnets: {
                           where: {
                              serverName: location // Фильтруем подсети по выбранному серверу
                            },
                            select: {
                                network: true,
                                serverName: true
                            }
                        },
                        role: {
                            select: {
                                name: true,
                                speed: true,
                                network: true
                            }
                        }
                      }
                    })

                // ip сервера чтобы не назначить его пользователю
                const wgIp = await defIp(fastify, location) 
                
                // вычесляем ip впн-пользователя исходя из его роли сеть / ip 
                const userSubnet = currentUser.subnets[0] // ок
                const userNet = userSubnet.network.replace(/\/.*/, `/${currentUser.role.network}`); // переписываем после "/" (меняем сидр)
                const [ip, mask] = userNet.split("/") // всё понтяно
                const ipCount = 2 ** (32 - Number(mask)) // Количество ip адресов в маске
                let [oct1, oct2, oct3, oct4] = ip.split(".").map(Number) // разбиваем ip на октеты и приобразуем в числа
                let ipRangeServ = [] // инициализируем массив в которм будут все доступные ip адереса пользователя (без broadcast)
                for (let i = 1; i < ipCount - 1; i++) {  // +1 и -1 исключаем броадкаст
                    ipRangeServ.push(`${oct1}.${oct2}.${oct3}.${oct4 + i}/${mask}`); // генерируем список доступных ip на ноде
                }

                const ipRange = ipRangeServ.filter(ip => ip !== (wgIp + "/28")) // если находим в массиве с ip , ip шлюза WG , то исключаем его

                // ищем все используемые ip в локации пользователя
                const usedIp = await fastify.prisma.client.findMany({
                    where: {
                        user: {
                          login: user // логин пользователя
                        },
                        serverName: location // выбранная локация (например, 'DE', 'RU', 'FI')
                    },
                    select: {
                        ip: true,
      
                    }
                })
     
                const usedIpsSet = new Set(usedIp.map(client => client.ip.split("/")[0])); // Разделяем на IP и маску
                const availableIps = ipRange.filter(ip => !usedIpsSet.has(ip.split("/")[0]));
              
                if (availableIps.length === 0) {
                    return reply.send({ onErr: "лимит локации"})
                } 
                const firstFreeIp = availableIps[0];
                
                const privateKey = crypto.randomBytes(32).toString('base64') // Приватный ключ
                const publicKey = crypto.createHash('sha256').update(privateKey).digest('base64') // Публичный ключ
                
                const servers = {
                  "RU": "ru.darksurf.ru",
                  "DE": "de.darksurf.ru",
                  "FI": "fi.darksurf.ru"
                }
                const endPoint = servers[location]

                const server = await fastify.prisma.server.findFirst({
                    where: {
                        serverName: location
                    },
                    select: {
                        id: true
                    }            
                })

                const newWgClient = {
                    name: wguser,
                    ip: firstFreeIp,
                    privateKey: privateKey,
                    publicKey: publicKey,
                    endPoint: endPoint,
                    serverName: location,
                    serverId: server.id,
                    userId: currentUser.id
                }
                
                await fastify.prisma.client.create({
                    data: newWgClient
                });
                await syncwg(fastify, location) // когда всё созданова отправляем информацию на wg-сервер
                return reply.send({ message: "valid"})
            }
            catch (onErr) {
                return reply.send({ 
                    message: "invalid",
                    onErr: `ошибка! ${onErr}`,
                })
            }
        })

        fastify.delete('/wg/create', {
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
                    const checkClient = await fastify.prisma.client.findFirst({ 
                        where: {
                            userId: Number(loginId),
                            id: Number(id)
                        },
                        select: {
                            name: true
                        }
                    })
                    // усли попытка подмены тогда инвалид
                    if (!checkClient) {
                        return reply.send({ message: "invalid", onErr: "запрещено, Клиент не пренадлежит пользователю"})
                    }
                    // определяем в какой локации клиент
                    const loc = await fastify.prisma.client.findFirst({
                        where: {
                            id: Number(id)
                        },
                        select: {
                            serverName: true
                        }
                    })

                    // если всё ок удаляем клиента
                    await fastify.prisma.client.delete({
                        where: {
                            id: Number(id) // delete только по одному параментру (призма)
                         }
                    })
                    await syncwg(fastify, loc.serverName) // отрплвяем новые данные на сервер

                    return reply.send({ message: "valid"})
                }
                catch (e) {
                    return reply.send({ message: "invalid", e})
                }
            }
        )

}