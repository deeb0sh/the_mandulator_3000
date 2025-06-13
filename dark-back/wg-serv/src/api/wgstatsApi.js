import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { paramReqValid } from '../schemas/paramReqValid.js'
import cron from 'node-cron'
import NodeCache from 'node-cache'
export default async function wgstatsApi(fastify) {
  
  // === регистрируем (ОПЯТЬ) плагин
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })

  const cache = new NodeCache({ 
    stdTTL: 180,
    checkperiod: 60 
  }) // создаём кеш для хранние данных на всегда ( хранимтся пока не перезапишется)

  const servers = {
    RU: 'http://wgru:3003/wgstats',
    DE: 'http://wgde:3003/wgstats',
    FI: 'http://wgfi:3003/wgstats'
  }

  const antiFlood = new Set(); // глобальная для предотвращения флуда
  const flag = {
              "RU": "🇷🇺",
              "DE": "🇩🇪",
              "FI": "🇫🇮" 
            };

  // === функция для опроса серверов и запили ответа в кеш
  async function wgStats(server) {
      // try-catch для fetch
      try {
        const response = await fetch(servers[server],{
          signal: AbortSignal.timeout(3000) // 3 сек ждём ответ если больше то AbortError или TimeoutError
        })  // 3000 мс
        const stats = await response.json()
        // --- записываем данные кеш и статус сервера
        cache.set(server, {
          status: 'online',
          data: stats,       // Основные данные статистики
          lastUpdated: new Date().toLocaleString()
        })
        // отправляем в телегу если сервер онлайн
        if (antiFlood.has(server)) {
          antiFlood.delete(server)
          // Отправляем в тлегу
          try {
            await fetch('http://bot:3333/bot/msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `✅ сервер ${flag[server]} поднялся !`
                })
            });
          } 
          catch (err) {
            console.error(`[WGSTATS] Ошибка при отправке уведомления в Telegram: ${err}`);
          }
        }

      } 
      catch (e) {
        cache.set(server, {
          status: 'offline',
          lastUpdated: new Date().toLocaleString()
        })
        
        console.log(`[${new Date().toLocaleString()}][WGSTATS] Сервер не отвечает - ${server}: ${e}`)
        
        if (!antiFlood.has(server)) {
          // Отправляем в тлегу
          try {
            await fetch('http://bot:3333/bot/msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `❌ Сервер ${flag[server]} упал!`
                })
            });
            antiFlood.add(server)
          } 
          catch (err) {
            console.error(`[WGSTATS] Ошибка при отправке уведомления в Telegram: ${err}`);
          }
          
        }
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
        // --- извлекаем из кеша
        const stats = cache.get(server) 
        if (stats.status === 'offline') {
          return reply.send(stats)
        }
        // --- получаем все публичные ключи пользователя из базы 
        const userPeers = await fastify.prisma.client.findMany({
          where: {
            user: {
              login: user
            },
            serverName: server
          },
          select: {
            id: true,
            publicKey: true
          }
        })
        const publicKeyToId = Object.fromEntries(
          userPeers.map(({ id, publicKey }) => [publicKey, id]) // для поскае id по publicKey
        )
        //const userPublicKeys = userPeers.map(pkey => pkey.publicKey) // оставляем в массиве userPeers только значения publicKey       
        
        const userStats = stats.data.peers
          .filter(peer => publicKeyToId.hasOwnProperty(peer.publicKey)) // оставляем только свои peers
          .map(({ publicKey, ...rest }) => ({
            ...rest,
            id: publicKeyToId[publicKey] // заменяем publicKey на id
        }))

        // const userStats = stats.data.peers.filter(peer => userPublicKeys.includes(peer.publicKey)) // выпиливаем из массива stats.data.peers всё лишнее кароче
        // //stats.data.peers = userPeers
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