import Fastify from "fastify";
import cors from '@fastify/cors';
import formbody from '@fastify/formbody'; // Импортируем @fastify/formbody

// Инициализация Fastify с логами
const fastify = Fastify({ logger: true });

// 1. Регистрация парсера для x-www-form-urlencoded
fastify.register(formbody);

// 2. Регистрация плагина CORS
fastify.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://darksurf.ru', 'https://www.darksurf.ru'];
    // Разрешаем запросы с указанных доменов или без Origin для всех методов
    callback(null, allowedOrigins.includes(origin) ? origin : '*');
  },
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  hideOptionsRoute: false,
  strictPreflight: true
});

// 3. Хук для проверки Origin, игнорирующий GET
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

// 4. Проксирование /auth/*
fastify.all('/auth/*', async (req, reply) => {
  try {
    const targetUrl = `http://auth:3000${req.raw.url}`;
    fastify.log.info(`Проксирование к: ${targetUrl}`);
    const headers = { ...req.headers };
    delete headers['content-length']; // Удаляем, чтобы fetch пересчитал
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined;
    fastify.log.info(`Отправляем: method=${req.method}, headers=${JSON.stringify(headers)}, body=${body}`);
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json') ? await response.json() : await response.text();
    fastify.log.info(`Ответ от auth: status=${response.status}, data=${JSON.stringify(data)}`);
    reply.status(response.status);
    return reply.send(data);
  } catch (e) {
    fastify.log.error(`Ошибка проксирования /auth: ${e.stack || e}`);
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Проксирование не удалось',
      details: e.message
    });
  }
});

// 5. Проксирование /wg/*
fastify.all('/wg/*', async (req, reply) => {
  try {
    const targetUrl = `http://wg-serv:3001${req.raw.url}`;
    fastify.log.info(`Проксирование к: ${targetUrl}`);
    const headers = { ...req.headers };
    delete headers['content-length']; // Удаляем, чтобы fetch пересчитал
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined;
    fastify.log.info(`Отправляем: method=${req.method}, headers=${JSON.stringify(headers)}, body=${body}`);
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json') ? await response.json() : await response.text();
    fastify.log.info(`Ответ от wg-serv: status=${response.status}, data=${JSON.stringify(data)}`);
    reply.status(response.status);
    return reply.send(data);
  } catch (e) {
    fastify.log.error(`Ошибка проксирования /wg: ${e.stack || e}`);
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Проксирование не удалось',
      details: e.message
    });
  }
});

// 6. Улучшенная обработка ошибок
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(`Глобальная ошибка: ${error.stack || error}`);
  return reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: error.message || 'Произошла ошибка',
    details: error.stack || 'Нет дополнительной информации'
  });
});

// 7. Запуск сервера
fastify.listen({ port: 2999, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(`Ошибка запуска сервера: ${err}`);
    process.exit(1);
  }
  console.log('BFF запущен на порту 2999');
});