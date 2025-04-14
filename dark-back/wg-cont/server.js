import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/ping', async () => {
  return { pong: true };
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
