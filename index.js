const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { swaggerSpec, swaggerUi } = require('./swagger');

const routes = require('./routes');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/error.controller');
const sequelize = require('./config/database');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps us protect our app by setting various HTTP headers
app.use(morgan('dev')); // log the requests in console

Object.values(routes).forEach((router) => app.use('/api', router));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// untracked routes
app.use(
	/(.*)/,
	catchAsync(async (req, res, next) => {
		throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
	}),
);

app.use(globalErrorHandler);

const SERVER_PORT = process.env.SERVER_PORT || 4444;

const startServer = async () => {
	try {
		await sequelize.authenticate();

		console.log(
			`Connected to PostgreSQL successfully (DB: ${sequelize.getDatabaseName()}, Port: ${
				sequelize.config.port
			})`,
		);

		app.listen(SERVER_PORT, () => {
			console.log(`Server started on port ${SERVER_PORT}`);
		});
	} catch (err) {
		console.error(`DB connection failed: ${err.message}`);
		process.exit(1);
	}
};

startServer();
