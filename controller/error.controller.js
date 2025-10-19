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
	if (err.name === 'SequelizeValidationError') {
		err = new AppError(err.message, 400);
	}

	if (err.name === 'SequelizeUniqueConstraintError') {
		err = new AppError('E-mail already registerd', 400);
	}

	if (process.env.NODE_ENV === 'development') {
		return sendErrorDev(err, res);
	}

	sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
