import Fastify from "fastify";
import wgCheckApi from './api/checkApi.js'
import prismaPlugin from './plugins/prisma.js'

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
fastify.register(prismaPlugin) // подключаем плагин призмы чтобы работало для всех роутов
fastify.register(wgCheckApi) // ==> ./api/wg.js



const start = async () => {
    try {
      await fastify.listen({ port: 3001, host: '0.0.0.0' })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()