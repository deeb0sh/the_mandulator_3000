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

bot.api.sendMessage(gid, 'Я готов к работе!');

async function query(data) {
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${hf_token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return await response.json();
}

async function getAI(message) {
  try {
    const response = await query({
      messages: [
        {
          role: 'system',
          content: 'Ты полезный ассистент, отвечай кратко и на русском. Для кода используй Markdown-форматирование с тройными обратными кавычками.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'zai-org/GLM-4.5:novita',
      max_tokens: 2048,
      temperature: 1,
      response_format: { type: 'text' },
    });

    let content = response.choices?.[0]?.message?.content || 'Я не понял вопроса...';
    // Удаление тегов <think>
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Удаление возможного экранирования обратных кавычек
    content = content.replace(/\\`/g, '`');
    return content;
  } catch {
    return 'нехуя не понятно, но очень интересно';
  }
}

bot.on('message:text', async (ctx) => {
  const userMessage = ctx.message.text;
  const isPrivateChat = ctx.message.chat.type === 'private';
  const isChannel = ctx.message.chat.type === 'channel' || ctx.message.chat.type === 'supergroup' || ctx.message.chat.type === 'group';

  if (isPrivateChat) {
    const aiResponse = await getAI(userMessage);
    await ctx.reply(aiResponse, { parse_mode: 'MarkdownV2' });
    return;
  }

  if (isChannel) {
    const mentionRegex = new RegExp(`^${BOT_NAME}\\s*`, 'i');
    const botWordRegex = /БОТ/i;
    const hasMention = mentionRegex.test(userMessage);
    const hasBotWord = botWordRegex.test(userMessage);
    const isReplyToBot = ctx.message.reply_to_message?.from?.id === bot.botInfo.id;

    if (hasMention || hasBotWord || isReplyToBot) {
      const cleanMessage = hasMention ? userMessage.replace(mentionRegex, '').trim() : userMessage;
      if (!cleanMessage) return;

      const aiResponse = await getAI(cleanMessage);
      await ctx.reply(aiResponse, { parse_mode: 'MarkdownV2' });
    }
  }
});

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