import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { paramReqValid } from '../schemas/paramReqValid.js'
import cron from 'node-cron'
import NodeCache from 'node-cache'
import AsyncLock from 'async-lock'
export default async function wgstatsApi(fastify) {
  
  // === регистрируем (ОПЯТЬ) плагин
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })

  const lock = new AsyncLock()

  const cache = new NodeCache({ stdTTL: 36000, checkperiod: 600 }) // создаём кеш для хранние данных на час ( хранимтся пока не перезапишется)

  const servers = {
    RU: 'http://wgru:3003/wgstats',
    DE: 'http://wgde:3003/wgstats',
    FI: 'http://wgfi:3003/wgstats'
  }

  // === функция для опроса серверов и запили ответа в кеш
  async function wgStats(server) {
    try {
      await lock.acquire(server, async () => {
        try {
          const response = await fetch(servers[server], { timeout: 3000 })  // 3000 мс
          const stats = await response.json()
          // --- записываем данные кеш и статус сервера
          cache.set(server, {
            status: 'online',
            data: stats,       // Основные данные статистики
            lastUpdated: new Date()
          })
        } 
        catch (e) {
          cache.set(server, {
            status: 'offline',
            data: { peers: [], error: e.message },  // Сохраняем текст ошибки сохраняя структуру объекта
            lastUpdated: new Date()
          })
          const errDate = new Date().toLocaleString()
          console.log(`[${errDate}] [WGSTATS] Сервер не отвечает - ${server}: ${e}`)
        }
      })
    } 
    catch (err) {
      console.log(`[WGSTATS] Ошибка блокировки для сервера ${server}:`, err)
      cache.set(server, {
        status: 'offline',
        data: { peers: [], error: 'Internal server error (lock failed)' },
        lastUpdated: new Date()
      })
    }
  }
  // === опрашиваем серверы каждые 5 секунд
  cron.schedule('*/5 * * * * *', async () => {
    await Promise.all(Object.keys(servers).map(wgStats));
  })
  
  // === енд-поинты для фронт-енда + валидация хедера 
  fastify.get('/wg/stats/:server', { 
    schema:{ 
      headers: headersJwtValid, // валидация хедера
      params: paramReqValid // валидация :server
    }}, async (request, reply) => {
      try {
        const decod = await request.jwtVerify()
        const user = decod.user
        const { server } = request.params
        // --- получаем все публичные ключи пользователя из базы 
        const userPeers = await fastify.prisma.client.findMany({
          where: {
            user: {
              login: user
            },
            serverName: server
          },
          select: {
            publicKey: true
          }
        });
        const userPublicKeys = userPeers.map(pkey => pkey.publicKey) // оставляем в массиве userPeers только значения publicKey       
        const stats = cache.get(server) // извлекаешь кеш с сервера
        if (stats.status === 'offline') {
          return reply.send(stats)
        }
        const userStats = stats.data.peers.filter(peer => userPublicKeys.includes(peer.publicKey)) // выпиливаем из массива stats.data.peers всё лишнее кароче
        //stats.data.peers = userPeers
        const normalStats = {
          status: stats.status,
          lastUpdated: stats.lastUpdated,
          data: {
            peers: userStats
          }
        }
        //console.log(JSON.stringify(stats, null, 2))
        return reply.send(normalStats)
      } 
      catch(e) {
        return reply.send({ message: "invalid", onErr: e})    
      }
  })
  
}