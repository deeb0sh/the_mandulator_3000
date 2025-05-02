import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru
const allowedOrigins = ['https://darksurf.ru'];

await fastify.register(cors, {
  origin: (origin, cb) => {
    // достаем метод
    const method = fastify.initialConfig.request.method;

    // корс на методах
    const protectedMethods = ['POST', 'PUT', 'DELETE'];

    if (protectedMethods.includes(method)) {
      if (origin && allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('CORS запрещён для этого источника'), false);
      }
    } else {
      // Разрешаем GET, OPTIONS, HEAD и др.
      cb(null, true);
    }
  },
  credentials: true
});


// Проксируем /auth/*
fastify.all('/auth/*', async (req, reply) => {
  const targetUrl = `http://auth:3000${req.raw.url}`
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })

  reply.status(response.status)
  const data = await response.text()
  return reply.send(data)
})

// Проксируем /wg/*
fastify.all('/wg/*', async (req, reply) => {
  const targetUrl = `http://wg-serv:3001${req.raw.url}`
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })

  reply.status(response.status)
  const data = await response.text()
  return reply.send(data)
})

fastify.listen({ port: 2999, host: '0.0.0.0' }, () => {
    console.log('bff na 2999')
});