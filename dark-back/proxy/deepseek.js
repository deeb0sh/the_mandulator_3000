import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import tunnel from 'tunnel'
import * as cheerio from 'cheerio'
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

// Middleware для обработки JSON, CORS и куки
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Настройки прокси 3proxy (замени на свои)
const proxyOptions = {
    host: '10.4.0.3', // Адрес прокси-сервера
    port: 3128,                // Порт прокси-сервера (по умолчанию 3128 для 3proxy)
    //proxyAuth: 'username:password', // Логин и пароль для прокси (если требуется)
};

// Создаем туннель для HTTPS через HTTP-прокси
const tunnelingAgent = tunnel.httpsOverHttp({
    proxy: proxyOptions,
});

// POST-запрос для получения HTML через прокси
app.post('/proxy', async (req, res) => {
    const { url } = req.body; // URL сайта, который нужно открыть

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Заголовки и куки пользователя
        const userHeaders = req.headers;
        const userCookies = req.cookies;

        // Отправляем запрос через прокси
        const response = await fetch(url, {
            agent: tunnelingAgent, // Используем туннель
            headers: {
                ...userHeaders, // Передаем заголовки пользователя
                cookie: Object.entries(userCookies)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('; '), // Передаем куки пользователя
            },
        });

        // Получаем HTML страницы
        const html = await response.text();

        // Возвращаем HTML
        res.json({ html });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch the website' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});