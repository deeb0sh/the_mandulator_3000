import Fastify from "fastify";
import wgCheckApi from './api/checkApi.js'
import wgCreateApi from './api/createApi.js'
import downloadApi from "./api/downloadApi.js";
import prismaPlugin from './plugins/prisma.js'
import checkServer from "./plugins/checkServer.js";
import checkRole from "./plugins/checkRole.js";
import dotenv from 'dotenv';
import cors from '@fastify/cors'

const fastify = Fastify({
    trustProxy: true, // Доверяем заголовку X-Forwarded-For
    logger: true,
})

dotenv.config(); // Подключаем переменные окружения

// Подключаем CORS и разрешаем только darksurf.ru
// const allowedOrigins = ['https://darksurf.ru', 'https://dev.darksurf.ru'];
// await fastify.register(cors, {
//   origin: (origin, cb) => {
//     if (origin && allowedOrigins.includes(origin)) {
//       cb(null, true);
//     } else {
//       cb(new Error('ACCES DENIED .i. / доступ запрещён , пожалуйста пройдите нахуй'), false);
//     }
//   }
// });

fastify.register(prismaPlugin) // подключаем плагин призмы чтобы работало для всех роутов
fastify.register(wgCheckApi) // ==> ./api/checkApi.js
fastify.register(wgCreateApi) // ==> ./api/createApi.js
fastify.register(downloadApi) // ==> ./api/downloadApi.js
fastify.register(checkServer) // запиливаем дефолтную инфу на сервер
fastify.register(checkRole) // запиливаем дефолтныу роли

const start = async () => {
    try {
      await fastify.listen({ port: 3001, host: '0.0.0.0' })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()