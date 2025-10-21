const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

		// TODO: check if need to change token generating method
		result.token = generateToken({
			id: result.id,
		});

		// Like in previous my NodeJS project Archakov posts
		// const token = jwt.sign(
		// 	{ id: result.id },
		// 	process.env.JWT_SECRET_KEY || 'secret123',
		// 	{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
		// );

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

		// This do indus
		const token = generateToken({
			id: result.id,
		});

		// Like in previous my NodeJS project Archakov posts
		// const token = jwt.sign(
		// 	{ id: result.id },
		// 	process.env.JWT_SECRET_KEY || 'secret123',
		// 	{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
		// );

		return res.json({
			status: 'success',
			firstName: result.firstName,
			lastName: result.lastName,
			token,
		});
	});

	authentication = catchAsync(async (req, res, next) => {
		// // 1. get the token from headers
		// let idToken = '';
		// if (
		// 	req.headers.authorization &&
		// 	req.headers.authorization.startsWith('Bearer')
		// ) {
		// 	// Bearer ajsdfodfgpupg
		// 	idToken = req.headers.authorization.split(' ')[1];
		// }
		// // TODO: resolve issue with Bearer, and remove next if(){}
		// if (!idToken) {
		// 	idToken = req.headers.authorization.split(' ')[0];
		// }
		const idToken = (req.headers.authorization || '').replace(/Bearer\s/, '');

		if (!idToken) {
			return next(new AppError('Please login to get access', 401));
		}

		// 2. token verification
		const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

		// 3. get the user detail from db and add to req object
		const freshUser = await tuser.findByPk(tokenDetail.id);
		if (!freshUser) {
			return next(new AppError('User no longer exists', 401));
		}
		req.user = freshUser;

		return next();
	});

	// TODO: like authentication, but check if userId === userId of entity
	// const redUserId = req.body.userId;

	getMe = catchAsync(async (req, res) => {
		const user = await tuser.findByPk(req.user.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}
		const { password, ...userData } = user.dataValues;
		return res.json(userData);
	});
}

module.exports = new AuthController();
