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
                const userSubnet = currentUser.subnets[0]
                const userNet = userSubnet.network.replace(/\/.*/, `/${currentUser.role.network}`); 
                const [ip, mask] = userNet.split("/")
                const ipCount = 2 ** (32 - Number(mask)) // Количество ip адресов в маске
                let [oct1, oct2, oct3, oct4] = ip.split(".").map(Number) // разбиваем ip на октеты и приобразуем в числа
                let ipRange = [] // инициализируем массив в которм будут все доступные ip адереса пользователя
                for (let i = 1; i < ipCount - 1; i++) {
                    ipRange.push(`${oct1}.${oct2}.${oct3}.${oct4 + i}/${mask}`); // генерируем список доступных ip на ноде
                }
                const privateKey = crypto.randomBytes(32).toString('base64') // Приватный ключ
                const publicKey = crypto.createHash('sha256').update(privateKey).digest('base64') // Публичный ключ
                
                // вычесляем ip впн-пользователя исходя из его роли сеть / ip 
                

                return reply.send({ message: "valid", wguser, location, privateKey, publicKey,ipCount , ipRange})
            }
            catch (onErr) {
                return reply.send({ 
                    message: "invalid",
                    onErr: `ошибка! ${onErr}`
                })
            }
        })
}