import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/error.middleware.js';
import { authentification } from './middlewares/auth.middleware.js';

import db from './database/index.js';
import router from './routers/index.js';

const { APP_PORT } = process.env;
await db.sequelize.authenticate();

//TODO enlever quand on passe en PROD !!!
await db.sequelize.sync({ alter: true });

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('tiny'));
app.use(authentification);
//TODO routing
app.use(router);
app.use(errorHandler);

app.listen(APP_PORT, () => {
	console.log(`   --🚨 Web API available at http://localhost:${APP_PORT} 🚨--`);
});
