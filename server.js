/* import express from 'express';
import dotenv from 'dotenv';
import { bot, handleMessage } from './bot.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
console.log('app created');

app.use(express.json());

app.get('/', (_, res) => {
    bot.sendMessage(5671085312, 'Server is running');
    console.log('get /: ');
    res.send('Hello World!');
    res.end();
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    console.log('post /bot: ', req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

handleMessage(bot);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 */