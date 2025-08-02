import { Bot } from 'grammy';
import { config } from 'dotenv';
import Fastify from 'fastify';

config();

const token = process.env.TELETOK;
const gid = process.env.GID;
const hf_token = process.env.HF_TOKEN;
const BOT_NAME = '@dsurf_bot';

const bot = new Bot(token);
const fastify = Fastify({ logger: false });

bot.api.sendMessage(gid, 'Я МАНДУЛЯТОР!');

fastify.post('/bot/msg', async (request, reply) => {
  const { message } = request.body;
  await bot.api.sendMessage(gid, message);
  return { status: 'ok' };
});

const start = async () => {
  try {
    await bot.init();
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
    await bot.start();
  } catch {
    process.exit(1);
  }
};

start();