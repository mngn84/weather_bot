import express from 'express';
import dotenv from 'dotenv';
import { bot } from './bot.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (_, res) => {
    res.end();
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
