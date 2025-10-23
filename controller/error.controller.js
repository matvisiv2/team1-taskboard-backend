const AppError = require('../utils/appError');

const sendErrorDev = (error, res) => {
	const statusCode = error.statusCode || 500;
	const status = error.status || 'error';
	const message = error.message;
	const stack = error.stack;

	res.status(statusCode).json({
		status,
		message,
		stack,
	});
};

const sendErrorProd = (error, res) => {
	const statusCode = error.statusCode || 500;
	const status = error.status || 'error';
	const message = error.message;
	const stack = error.stack;

	if (error.isOperational) {
		res.status(statusCode).json({
			status,
			message,
		});
	}

	return res.status(500).json({
		status: 'error',
		message: 'Something went very wrong',
	});
};

const globalErrorHandler = (err, req, res, next) => {
	if (err.name === 'JsonWebTokenError') {
		err = new AppError('Invalid token', 401);
	}

	if (err.name === 'SequelizeForeignKeyConstraintError') {
		const table = /"([^\\"]+)"/.exec(err.message)[1];
		let message = '';
		switch (table) {
			case 'board':
				message = "Don't exist user with this id";
				break;
			case 'column':
				message = "Don't exist board with this id";
				break;
			case 'task':
				message = "Don't exist column with this id";
				break;
			case 'comment':
				message = "Don't exist task with this id";
				break;
			case 'label':
				message = "Don't exist task with this id";
				break;
			case 'collaborato':
				message = "Don't exist user or board with this id";
				break;
			default:
				message = "Don't exist something with this id";
				break;
		}
		err = new AppError(message, 400);
	}

	if (err.name === 'SequelizeValidationError') {
		err = new AppError(err.message, 400);
	}

	if (err.name === 'SequelizeUniqueConstraintError') {
		// err = new AppError('E-mail already registerd', 400);
		err = new AppError('This value already exist', 400);
	}

	if (process.env.NODE_ENV === 'development') {
		return sendErrorDev(err, res);
	}

	sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
