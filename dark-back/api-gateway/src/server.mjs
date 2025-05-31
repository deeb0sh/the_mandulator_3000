import Fastify from "fastify";
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

// Регистрация плагина CORS с жёсткой фильтрацией по Origin
fastify.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://darksurf.ru', 'https://dev.darksurf.ru'];
    // Разрешаем запросы только с указанных доменов
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Блокируем запросы с неподходящих доменов или без Origin
      callback(new Error('Доступ запрещён. Пожалуйста, пройдите нахуй'), false);
    }
  },
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // Обрабатываем ошибку CORS
  hideOptionsRoute: false,
  strictPreflight: true
});

// Обработка ошибок CORS
fastify.setErrorHandler((error, request, reply) => {
  if (error.message.includes('Origin')) {
    reply
      .status(403)
      .header('Content-Type', 'text/plain')
      .send('Доступ запрещён. Пожалуйста, пройдите нахуй');
  } else {
    reply.send(error);
  }
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