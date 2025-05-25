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

  const cache = new NodeCache({ stdTTL: 0 }) // создаём кеш для хранние данных 0 сек ( хранимтся пока не перезапишется)

  const servers = {
    RU: 'http://wgru:3003/wgstats',
    DE: 'http://wgde:3003/wgstats',
    FI: 'http://wgfi:3003/wgstats'
  }

  // === функция для опроса серверов и запили ответа в кеш
  async function wgStats(server) {
    try{
      const response = await fetch(servers[server], { timeout: 3000 }) 
      const stats = await response.json()
      cache.set(server, { status: 'online', date: new Date() }, stats) // записываем данные кеш и статус сервера
    } 
    catch (e) {
      cache.set(server,{ status: 'offline', date: new Date() })
      console.log(`${new Date()} - Сервер не отвечает - ${server}: ${e}`)
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
        const { server } = require.params
        const stats = cache.get(server)
        return reply.send(stats || { message: 'Нет данных для сервера ' + server })
      } 
      catch(e) {
        return reply.send({ message: "invalid", onErr: e})    
      }
  })

}