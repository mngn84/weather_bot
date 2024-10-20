import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT;
console.log('app created');

app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });
bot.setWebHook(`${process.env.APP_URL}/bot${process.env.BOT_TOKEN}`);

console.log('Bot is running...');
app.get('/', (_, res) => {
    console.log('get /: ');
        // bot.sendMessage(5671085312, 'Server is running');
        res.send('Server is running');
    // res.end('Server is running');
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    console.log('post /bot: ');
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const cachedCoords = new Map();

bot.on('message', (msg) => {
    console.log('bot.on:', msg.text);
    if (msg.text === '/start') {
        bot.sendMessage(msg.chat.id, "Привет! Я бот погоды. Введите название города, чтобы узнать погоду в нём.");
    } else if (/^[A-Za-zА-Яа-я](?:[\s-][A-Za-zА-Яа-я0-9]+)*/.test(msg.text)) {
        getWeather(msg);
    } else {
        bot.sendMessage(msg.chat.id, "Введите корректное название города.");
    }
});

const getWeather = async (msg) => {
    try {
        let coords;

        if (cachedCoords.has(msg.text)) {
            coords = cachedCoords.get(msg.text);
        } else {
            coords = await getCoords(msg);
            cachedCoords.set(msg.text, coords);
        }

        const { lat, lon } = coords;
        const response = await axios.get('https://ru.api.openweathermap.org/data/2.5/weather', {
            params: {
                lat,
                lon,
                appid: process.env.API_KEY,
                units: 'metric',
                lang: 'ru',
            },
        });

        const data = response.data;
        const message = `Погода в ${msg.text}: ${data.weather[0].description}, температура: ${data.main.temp}°C`;

        bot.sendMessage(msg.chat.id, message);
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Не удалось получить данные о погоде для указанного города.\nВведите название города еще раз.");
    }
}

const getCoords = async (msg) => {
    try {
        const geoResponse = await axios.get('http://ru.api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: msg.text,
                limit: 1,
                appid: process.env.API_KEY,
            },
        });

        const { lat, lon } = geoResponse.data[0];
        return { lat, lon };
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Не удалось получить координаты для указанного города.\nВведите название города еще раз.");
    }
}

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
