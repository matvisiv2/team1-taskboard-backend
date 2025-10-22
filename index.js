const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const boardRouter = require('./routes/board.routes');
const columnRouter = require('./routes/column.routes');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/error.controller');
const sequelize = require('./config/database');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps us protect our app by setting various HTTP headers
app.use(morgan('dev')); // log the requests in console

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', boardRouter);
app.use('/api', columnRouter);

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
