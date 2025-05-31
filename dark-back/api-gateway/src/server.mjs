import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true })

// CORS — только для darksurf.ru
fastify.addHook('onRequest', (request, reply, done) => {
  const allowedOrigin = ['https://darksurf.ru', 'https://darksurf.ru']
    // 1. Разрешаем все GET/HEAD/OPTIONS запросы
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return done();
  }

  // 2. Для POST/DELETE/PUT:
  const origin = request.headers.origin;
  
  // Жёстко блокируем если нет Origin
  if (!origin) {
    return reply.status(403)
      .header('Content-Type', 'text/plain')
      .send('Доступ запрещён. Пожалуйста пройдите нахуй');
  }

  // Проверяем соответствие Origin
  if (origin !== allowedOrigin) {
    return reply.status(403)
      .header('Content-Type', 'text/plain')
      .send('Доступ запрещён. Пожалуйста пройдите нахуй');
  }

  // Добавляем CORS-заголовки для успешных запросов
  reply.header('Access-Control-Allow-Origin', origin);
  done();
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
