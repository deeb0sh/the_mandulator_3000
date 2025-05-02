import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru
await fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigin = 'https://darksurf.ru';
    
    // Получаем метод запроса из контекста выполнения
    const req = this.request; // Доступ к текущему запросу
    
    // 1. Разрешаем все GET-запросы без проверок
    if (req?.method === 'GET') {
      return cb(null, true);
    }
    
    // 2. Для POST/DELETE/PUT:
    // - Если Origin отсутствует (не браузер) - разрешаем
    // - Если Origin совпадает - разрешаем
    if (!origin || origin === allowedOrigin) {
      return cb(null, true);
    }
    
    // 3. Блокируем все остальное
    cb(new Error('CORS: Доступ разрешен. Пожалуйста пройдите нахуй'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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