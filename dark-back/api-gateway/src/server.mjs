import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru

await fastify.register(cors, {
  origin: [
    "https://darksurf.ru",
    /\.darksurf\.ru$/,  // все поддомены
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Явно разрешаем GET
  allowedHeaders: [
    "Authorization",  // Разрешаем заголовок с токеном
    "Content-Type",
    "X-Fingerprint",  // Ваш кастомный заголовок
  ],
  credentials: true,  // Обязательно для запросов с куками/токенами
  preflightContinue: false,  // Fastify сам обработает OPTIONS
});

// const allowedOrigins = ['https://darksurf.ru'];
// await fastify.register(cors, {
//   origin: (origin, cb) => {
//     if (origin && allowedOrigins.includes(origin)) {
//       cb(null, true);
//     } else {
//       cb(new Error(' доступ запрещён , пожалуйста пройдите нахуй '), false);
//     }
//   }
// });

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