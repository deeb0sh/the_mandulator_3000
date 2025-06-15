import Fastify from 'fastify'
import ajvErrors from 'ajv-errors' // еррор-плагин сообщения
import regApi from './api/reg.js'
import newpassApi from './api/newpass.js'
import panelApi from './api/panel.js'
import loginApi from './api/login.js'
import incodeApi from './api/incode.js'
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

fastify.register(newpassApi) // ==> auth/newpass (api/newpass.js)
fastify.register(loginApi) // ==> auth/login (api/login.js)
fastify.register(regApi) // ==> auth/reg (api/reg.js)
fastify.register(incodeApi) // ==> auth/incode (api/incode.js)
fastify.register(panelApi) // ==> auth/panek (api/panel.js)

// fastify.get('/', async (request, reply) => {
//     return { message: '8===D~~' };
//   });
  

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});