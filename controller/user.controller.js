const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { user: User } = require('../db/models');
const { isAdmin } = require('../utils/userHelpers');

class UserController {
	createUser = catchAsync(async (req, res, next) => {
		const newUser = await User.create(req.body);
		if (!newUser) {
			return next(new AppError('Failed to create user', 500));
		}
		return res.status(201).json(newUser);
	});

	getUsers = catchAsync(async (req, res, next) => {
		const users = await User.findAll();
		if (!users) {
			return next(new AppError('No users found', 404));
		}
		return res.status(200).json(users);
	});

	getUserById = catchAsync(async (req, res, next) => {
		const user = await User.findByPk(req.params.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}
		return res.status(200).json(user);
	});

	updateUser = catchAsync(async (req, res, next) => {
		const userData = req.body;

		if (req.user.id != req.params.id) {
			if (!isAdmin(user)) {
				return next(
					new AppError('You do not have permission to update this user', 403),
				);
			}
		}

		if (req.user.id == req.params.id) {
			userData.userType = req.user.userType; // Prevent user from changing their own userType
		}

		const user = await User.findByPk(req.params.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}

		await user.update({
			userType: userData.userType,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
		});

		return res.status(200).json(user);
	});

	// TODO: Implement change user email functionality

	changePassword = catchAsync(async (req, res, next) => {
		const user = await User.findByPk(req.params.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}

		const checkOldPassword = await bcrypt.compare(
			req.body.oldPassword,
			user.password,
		);
		if (!checkOldPassword) {
			return next(new AppError('Incorrect old password', 401));
		}

		await user.update({
			password: req.body.newPassword,
			confirmPassword: req.body.confirmPassword,
		});

		return res.status(200).json({ message: 'Password changed successfully' });
	});

	deleteUser = catchAsync(async (req, res, next) => {
		await User.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'User successfully deleted' });
	});
}

module.exports = new UserController();
