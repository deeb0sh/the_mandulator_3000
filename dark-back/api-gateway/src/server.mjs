import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

// Регистрация плагина CORS
fastify.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://darksurf.ru', 'https://dev.darksurf.ru'];
    // Разрешаем запросы с указанных доменов или без Origin для всех методов
    callback(null, allowedOrigins.includes(origin) ? origin : '*');
  },
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  hideOptionsRoute: false,
  strictPreflight: true
});

// Хук для проверки Origin, игнорирующий GET
fastify.addHook('onRequest', (request, reply, done) => {
  const allowedOrigins = ['https://darksurf.ru', 'https://dev.darksurf.ru'];
  const origin = request.headers.origin;

  // Пропускаем GET-запросы без проверки Origin
  if (request.method === 'GET') {
    return done();
  }

  // Для остальных методов проверяем Origin
  if (!origin || !allowedOrigins.includes(origin)) {
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

// Обработка ошибок
fastify.setErrorHandler((error, request, reply) => {
  reply.send(error);
});

// Запуск сервера
fastify.listen({ port: 2999, host: '0.0.0.0' }, () => {
  console.log('BFF запущен на порту 2999');
});