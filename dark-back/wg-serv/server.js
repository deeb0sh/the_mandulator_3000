import Fastify from "fastify";

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

const start = async () => {
    try {
      await fastify.listen({ port: 3001, host: '0.0.0.0' })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()