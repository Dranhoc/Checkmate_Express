import { configureSeparator, configureClog, ansiBackground } from 'console-separator';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/error.middleware.js';
import { authentification } from './middlewares/auth.middleware.js';
import cors from 'cors';

import db from './database/index.js';
import router from './routers/index.js';

configureSeparator({
	char: '-',
	color: 'green',
});
configureClog({
	color: 'white',
	bold: true,
	background: ansiBackground(22),
	emoji: '🔥',
});

const { APP_PORT } = process.env;
await db.sequelize.authenticate();

const app = express();
app.use(
	cors({
		origin: '*',
	}),
);

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('tiny'));
app.use(authentification);
app.use(router);
app.use(errorHandler);

app.listen(APP_PORT, () => {
	console.alog(`Web API available at http://localhost:${APP_PORT}`);
	// console.plog('console.plog');
	// console.ilog('Beautiful italian error');
	// console.clog('console.clog');
});
