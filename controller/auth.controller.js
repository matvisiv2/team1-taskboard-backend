const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../db');
const tuser = require('../db/models/tuser');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

class AuthController {
	signUp = catchAsync(async (req, res, next) => {
		const body = req.body;
		const newUser = await tuser.create({
			userType: '0',
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			password: body.password,
			confirmPassword: body.confirmPassword,
		});

		if (!newUser) {
			return next(new AppError('Failed to create user', 400));
		}

		const result = newUser.toJSON();

		delete result.password;
		delete result.deletedAt;

		result.token = generateToken({
			id: result.id,
		});

		return res.json({ status: 'success', result });
	});

	signIn = catchAsync(async (req, res, next) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new AppError('Please provide email and password', 400));
		}

		const result = await tuser.findOne({ where: { email } });

		if (!result || !(await bcrypt.compare(password, result.password))) {
			return next(new AppError('Incorrect mail or password', 401));
		}

		const token = generateToken({
			id: result.id,
		});

		return res.json({
			status: 'success',
			token,
		});
	});
}

module.exports = new AuthController();
