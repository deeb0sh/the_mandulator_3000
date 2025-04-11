import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { wgNameValid } from '../schemas/wgNameValid.js'
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
                // вычесляем ip впн-пользователя исходя из его роли сеть / ip 
                const userSubnet = currentUser.subnets[0] // ок
                const userNet = userSubnet.network.replace(/\/.*/, `/${currentUser.role.network}`); // переписываем после "/" (меняем сидр)
                const [ip, mask] = userNet.split("/") // всё понтяно
                const ipCount = 2 ** (32 - Number(mask)) // Количество ip адресов в маске
                let [oct1, oct2, oct3, oct4] = ip.split(".").map(Number) // разбиваем ip на октеты и приобразуем в числа
                let ipRange = [] // инициализируем массив в которм будут все доступные ip адереса пользователя (без broadcast)
                for (let i = 1; i < ipCount - 1; i++) {  // +1 и -1 исключаем броадкаст
                    ipRange.push(`${oct1}.${oct2}.${oct3}.${oct4 + i}/${mask}`); // генерируем список доступных ip на ноде
                }
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
                    return reply.send({ onErr: "достигнуты лимиты по локации" })
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

                return reply.send({ message: "valid", newWgClient, firstFreeIp})
            }
            catch (onErr) {
                return reply.send({ 
                    message: "invalid",
                    onErr: `ошибка! ${onErr}`
                })
            }
        })
}