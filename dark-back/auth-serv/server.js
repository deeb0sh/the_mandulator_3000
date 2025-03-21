import Fastify from 'fastify'
import ajvErrors from 'ajv-errors' // еррор-плагин сообщения
import cors from '@fastify/cors'
import regApi from './api/reg.js'
import loginApi from './api/login.js'
import prismaPlugin from './plugins/prisma.js'
import cronDeleteToken from './utils/cron.js'

const fastify = Fastify({
    trustProxy: true, // Доверяем заголовку X-Forwarded-For
    logger: true,
    ajv: {
        customOptions: {
            allErrors: true,
            $data: true
        },
        plugins: [ajvErrors]
    }
})

fastify.register(prismaPlugin) // подключаем плагин призмы чтобы работало для всех роутов

cronDeleteToken(fastify) // запуск cron.js

fastify.register(loginApi) // ==> auth/reg (api/loginApi.js)
fastify.register(regApi) // ==> auth/reg (api/regApi.js)

fastify.register(cors,{ // залупа
    origin: ['darksurf.ru'], // примаем запросы отовсюду
    methods: ['GET', 'POST'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    //credentials: true,
})

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});