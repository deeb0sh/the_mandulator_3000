import Fastify from "fastify";
import wgCheckApi from './api/checkApi.js'
import prismaPlugin from './plugins/prisma.js'
import checkServer from "./plugins/checkServer.js";
import checkRole from "./plugins/checkRole.js";
import dotenv from 'dotenv';

const fastify = Fastify({
    trustProxy: true, // Доверяем заголовку X-Forwarded-For
    logger: true,
    // ajv: {
    //     customOptions: {
    //         allErrors: true,
    //         $data: true
    //     },
    //     plugins: [ajvErrors]
    // }
})

dotenv.config(); // Подключаем переменные окружения

fastify.register(prismaPlugin) // подключаем плагин призмы чтобы работало для всех роутов
fastify.register(wgCheckApi) // ==> ./api/wg.js
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