import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru
const allowedOrigins = ['https://darksurf.ru'];
await fastify.register(cors, {
  origin: (origin, cb) => {
    // Разрешаем без origin
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Доступ запрещён. Пожалуйста пройдите нахуй'), false);
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