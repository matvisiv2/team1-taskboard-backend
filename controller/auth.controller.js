const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { user: User } = require('./../db/models');

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'secret_key_jwt', {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
};

class AuthController {
	signUp = catchAsync(async (req, res, next) => {
		const body = req.body;
		const newUser = await User.create({
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

		const user = await user.findOne({ where: { email } });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return next(new AppError('Incorrect mail or password', 401));
		}

		const result = user.toJSON();
		delete result.password;
		delete result.deletedAt;
		result.token = generateToken({
			id: user.id,
		});

		return res.json({ status: 'success', result });
	});

	authentication = catchAsync(async (req, res, next) => {
		// 1. get the token from headers
		const idToken = (req.headers.authorization || '').replace(/Bearer\s/, '');
		if (!idToken) {
			return next(new AppError('Please login to get access', 401));
		}

		// 2. token verification
		const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
		console.log(User);
		// 3. get the user detail from db and add to req object
		const freshUser = await User.findByPk(tokenDetail.id);
		if (!freshUser) {
			return next(new AppError('User no longer exists', 401));
		}
		req.user = freshUser;

		return next();
	});

	// TODO: like authentication, but check if userId === userId of entity

	getMe = catchAsync(async (req, res) => {
		const user = await user.findByPk(req.user.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}
		const { password, ...result } = user.dataValues;
		return res.status(200).json({ status: 'success', result });
	});

	// TODO: maybe need checkOwner and collaborator
	// checkBoardOwnerOrCollaborator = catchAsync(async (req, res, next) => {
	// 	const userId = req.user.id;
	// 	const boardId = req.params.id;

	// 	const board = await boardModel.findByPk(boardId);
	// 	if (!board) {
	// 		return next(new AppError('Board not found', 404));
	// 	}

	// 	if (board.userId !== userId) {
	// 		return next(new AppError('You do not have permission to access this board', 403));
	// 	}

	// 	req.board = board;
	// 	return next();
	// });
}

module.exports = new AuthController();
