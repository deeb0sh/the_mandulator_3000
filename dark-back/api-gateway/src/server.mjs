import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru
await fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigin = 'https://darksurf.ru';
    // GET-запросы всегда разрешаем
    const reqMethod = fastify.initialConfig.request?.method || 'GET';

    if (!origin) {
      cb(null, true); // Без Origin — значит, не браузер
    } else if (reqMethod === 'GET') {
      cb(null, true);
    } else if (origin === allowedOrigin) {
      cb(null, true);
    } else {
      cb(new Error('Доступ запрещён. Пожалуйста пройдите нахуй'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE']
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