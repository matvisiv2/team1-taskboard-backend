const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'team1_taskboard API',
			version: '1.0.0',
			description: 'Automatic documentation for Express API',
		},
		servers: [
			{
				url: process.env.API_PREFIX || '/api',
				description: 'Base API path',
			},
		],
	},
	apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
