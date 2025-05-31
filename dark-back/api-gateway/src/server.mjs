import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

// Регистрация плагина CORS
fastify.register(cors, {
  origin: ['https://darksurf.ru', 'https://dev.darksurf.ru'],
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Хук для дополнительной проверки CORS
fastify.addHook('onRequest', (request, reply, done) => {
  const allowedOrigins = ['https://darksurf.ru', 'https://dev.darksurf.ru'];
  const origin = request.headers.origin;

  // Разрешаем GET, HEAD, OPTIONS без проверки origin
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return done();
  }

  // Блокируем запросы без Origin
  if (!origin) {
    return reply
      .status(403)
      .header('Content-Type', 'text/plain')
      .send('Доступ запрещён. Пожалуйста, пройдите нахуй');
  }

  // Проверяем, что Origin входит в список разрешённых
  if (!allowedOrigins.includes(origin)) {
    return reply
      .status(403)
      .header('Content-Type', 'text/plain')
      .send('Доступ запрещён. Пожалуйста, пройдите нахуй');
  }

  done();
});

// Проксирование /auth/*
fastify.all('/auth/*', async (req, reply) => {
  const targetUrl = `http://auth:3000${req.raw.url}`;
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });

  reply.status(response.status);
  const data = await response.text();
  return reply.send(data);
});

// Проксирование /wg/*
fastify.all('/wg/*', async (req, reply) => {
  const targetUrl = `http://wg-serv:3001${req.raw.url}`;
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });

  reply.status(response.status);
  const data = await response.text();
  return reply.send(data);
});

// Запуск сервера
fastify.listen({ port: 2999, host: '0.0.0.0' }, () => {
  console.log('BFF запущен на порту 2999');
});