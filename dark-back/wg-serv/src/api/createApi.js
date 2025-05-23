import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { wgNameValid } from '../schemas/wgNameValid.js'
import { wgid } from '../schemas/wgid.js'
import syncwg from '../utils/syncwg.js'
import defIp from '../utils/defaultIp.js'
import { generateWireGuardKeys } from '../utils/wireguard.js'

export default async function wgCreateApi(fastify) {
    fastify.register(jwt, {
        secret: process.env.JWT_SECRET
    })

    fastify.post('/wg/create', {
        schema: {
            headers: headersJwtValid,
            body: wgNameValid
        }
    },
    async (request, reply) => {
        try {
            const decod = await request.jwtVerify()
            fastify.log.info(`JWT верифицирован: ${JSON.stringify(decod)}`)
            
            const user = decod.user
            const { wguser, location } = request.body
            fastify.log.info(`Создание WG клиента: ${wguser}, локация: ${location}, пользователь: ${user}`)

            const currentUser = await fastify.prisma.users.findFirst({
                where: { login: user },
                select: {
                    id: true,
                    subnets: {
                        where: { serverName: location },
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

            fastify.log.info(`Пользователь из БД: ${JSON.stringify(currentUser)}`)

            const wgIp = await defIp(fastify, location)
            fastify.log.info(`IP сервера (исключаемый): ${wgIp}`)

            const userSubnet = currentUser.subnets[0]
            const userNet = userSubnet.network.replace(/"/g, '').replace(/\/.*/, `/${currentUser.role.network}`)
            fastify.log.info(`Подсеть пользователя после коррекции маски: ${userNet}`)

            const [ip, mask] = userNet.split("/")
            const ipCount = 2 ** (32 - Number(mask))
            let [oct1, oct2, oct3, oct4] = ip.split(".").map(Number)
            let ipRangeServ = []

            for (let i = 1; i < ipCount - 1; i++) {
                ipRangeServ.push(`${oct1}.${oct2}.${oct3}.${oct4 + i}/${mask}`)
            }

            const ipRange = ipRangeServ.filter(ip => ip !== (wgIp + "/28"))
            fastify.log.info(`Доступные IP после исключения шлюза: ${JSON.stringify(ipRange)}`)

            const usedIp = await fastify.prisma.client.findMany({
                where: {
                    user: { login: user },
                    serverName: location
                },
                select: {
                    ip: true
                }
            })

            const usedIpsSet = new Set(usedIp.map(client => client.ip.split("/")[0]))
            const availableIps = ipRange.filter(ip => !usedIpsSet.has(ip.split("/")[0]))

            fastify.log.info(`Свободные IP: ${JSON.stringify(availableIps)}`)

            if (availableIps.length === 0) {
                return reply.send({ onErr: "лимит локации" })
            }

            const firstFreeIp = availableIps[0]
            const { privateKey, publicKey } = await generateWireGuardKeys() // генерируем пару ключей
            //const privateKey = crypto.randomBytes(32).toString('base64')
            //const publicKey = crypto.createHash('sha256').update(privateKey).digest('base64')

            const servers = {
                "RU": "ru.darksurf.ru",
                "DE": "de.darksurf.ru",
                "FI": "fi.darksurf.ru"
            }
            const endPoint = servers[location]

            const server = await fastify.prisma.server.findFirst({
                where: { serverName: location },
                select: { id: true }
            })

            const newWgClient = {
                name: wguser,
                ip: firstFreeIp,
                privateKey,
                publicKey,
                endPoint,
                serverName: location,
                serverId: server.id,
                userId: currentUser.id
            }

            fastify.log.info(`Создаём нового клиента WG: ${JSON.stringify(newWgClient)}`)

            await fastify.prisma.client.create({ data: newWgClient })
            await syncwg(fastify, location)

            return reply.send({ message: "valid" })
        }
        catch (onErr) {
            fastify.log.error(`Ошибка при создании WG клиента: ${onErr}`)
            return reply.send({ 
                message: "invalid",
                onErr: `ошибка! ${onErr}`
            })
        }
    })

    fastify.delete('/wg/create', {
        schema: {
            headers: headersJwtValid,
            body: wgid
        }
    },
    async (request, reply) => {
        try {
            const decod = await request.jwtVerify()
            const user = decod.user
            fastify.log.info(`Запрос на удаление WG клиента пользователем: ${user}`)

            const { id } = request.body
            fastify.log.info(`ID клиента на удаление: ${id}`)

            const login = await fastify.prisma.users.findFirst({
                where: { login: user },
                select: { id: true }
            })

            const loginId = login.id
            const checkClient = await fastify.prisma.client.findFirst({
                where: {
                    userId: Number(loginId),
                    id: Number(id)
                },
                select: { name: true }
            })

            if (!checkClient) {
                fastify.log.warn(`Попытка удалить чужого клиента: ${id} пользователем: ${user}`)
                return reply.send({ message: "invalid", onErr: "запрещено, Клиент не пренадлежит пользователю" })
            }

            const loc = await fastify.prisma.client.findFirst({
                where: { id: Number(id) },
                select: { serverName: true }
            })

            fastify.log.info(`Удаляем клиента ID=${id}, локация: ${loc.serverName}`)

            await fastify.prisma.client.delete({
                where: { id: Number(id) }
            })

            await syncwg(fastify, loc.serverName)

            return reply.send({ message: "valid" })
        }
        catch (e) {
            fastify.log.error(`Ошибка при удалении WG клиента: ${e}`)
            return reply.send({ message: "invalid", e })
        }
    })
}
