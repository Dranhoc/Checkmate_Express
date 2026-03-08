import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

const { APP_PORT, APP_URL } = process.env;

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Checkmate API',
			version: '1.0.0',
			description: 'CheckMate API documentation',
		},
		servers: [{ url: `${APP_URL}:${APP_PORT}` }],
	},
	apis: [
		'./src/routers/*.router.js', // scan all the .router.js
	],
};

export default swaggerJsdoc(options);
