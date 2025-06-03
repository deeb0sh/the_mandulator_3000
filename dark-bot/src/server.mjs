import { Bot } from 'grammy';
import { config } from 'dotenv';

config();

const token = process.env.TELETOK;
const gid = process.env.GID;

const bot = new Bot(token);

// bot.api.sendMessage(gid, 'я запущен');


bot.start();
