import { Bot } from 'grammy';
import { config } from 'dotenv';
import Fastify from 'fastify';

config(); // прочитать .env в текущеи каталоге

const token = process.env.TELETOK;
const gid = process.env.GID;

const bot = new Bot(token);
const fastify = Fastify({
  logger: false
});

fastify.post('/bot/msg', async (request, reply) => {
    try {
        const { message } = request.body; 
        bot.api.sendMessage(gid, message);
    } 
    catch (err) {
        console.log('[BOT] Ошибка отправлки сообщения в телегу');
    }
});

const start = async () => {
    try {
      await fastify.listen({ port: 3333, host: '0.0.0.0' });
      console.log('[BOT] fastify стартовал')
      await bot.start();
      console.log('[BOT] bot стартовал')
    } catch (err) {
      console.log(`[BOT] Ошибка - ${err}`);
      process.exit(1);
    }
  }

start();

