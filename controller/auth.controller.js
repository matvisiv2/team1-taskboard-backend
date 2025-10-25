const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('../utils/jwt');
const { isAdmin } = require('../utils/userHelpers');
const {
	user: User,
	board: Board,
	column: Column,
	task: Task,
	label: Label,
	collaborator: Collaborator,
	comment: Comment,
} = require('./../db/models');

class AuthController {
	signUp = catchAsync(async (req, res, next) => {
		const body = req.body;
		const newUser = await User.create({
			...req.body,
			userType: process.env.USER_TYPE_USER || '0',
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

		const user = await User.findOne({ where: { email } });

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

		// 3. get the user detail from db and add to req object
		const freshUser = await User.findByPk(tokenDetail.id);
		if (!freshUser) {
			return next(new AppError('User no longer exists', 401));
		}
		req.user = freshUser;

		return next();
	});

	checkAdminRights = catchAsync(async (req, res, next) => {
		if (!isAdmin(req.user)) {
			return next(
				new AppError('You do not have permission to perform this action', 403),
			);
		}

		return next();
	});

	async canEditBoard (user, boardId) {
		if (isAdmin(user)) return true;

		const board = await Board.findByPk(boardId);
		if (!board) throw new AppError('Board not found', 404);

		if (board.userId === user.id) return true;

		const collaborator = await Collaborator.findOne({
			where: { boardId, userId: user.id },
		});

		return !!collaborator;
	}

	async canEditColumn (user, columnId) {
		if (isAdmin(user)) return true;

		const column = await Column.findByPk(columnId);
		if (!column) throw new AppError('Column not found', 404);

		return this.canEditBoard(user, column.boardId);
	}

	async canEditLabels (user, labelId) {
		if (isAdmin(user)) return true;

		const label = await Label.findByPk(labelId);
		if (!label) throw new AppError('Label not found', 404);

		return this.canEditBoard(user, label.boardId);
	}

	async canEditTask (user, taskId) {
		if (isAdmin(user)) return true;

		const task = await Task.findByPk(taskId);
		if (!task) throw new AppError('Task not found', 404);

		const column = await Column.findByPk(task.columnId);
		if (!column) throw new AppError('Column not found', 404);

		return this.canEditBoard(user, column.boardId);
	}

	checkEditUserRights = catchAsync(async (req, res, next) => {
		if (isAdmin(req.user)) return true;

		const userId = req.params.id ?? req.params.userId;
		const hasRights = req.user.id == userId;

		if (!hasRights) {
			throw new AppError('You do not have permission to edit this user', 403);
		}

		return next();
	});

	checkEditBoardRights = catchAsync(async (req, res, next) => {
		const boardId = req.params.id ?? req.params.boardId;
		const hasRights = await this.canEditBoard(req.user, boardId);

		if (!hasRights) {
			throw new AppError('You do not have permission to edit this board', 403);
		}

		return next();
	});

	checkEditColumnRights = catchAsync(async (req, res, next) => {
		const columnId = req.params.id ?? req.params.columnId;
		const column = await Column.findByPk(columnId);
		if (!column) throw new AppError('Column not found', 404);

		const hasRights = await this.canEditBoard(req.user, column.boardId);
		if (!hasRights) {
			throw new AppError('You do not have permission to edit this column', 403);
		}

		return next();
	});

	checkEditTaskRights = catchAsync(async (req, res, next) => {
		const taskId = req.params.id;
		const task = await Task.findByPk(taskId);
		if (!task) throw new AppError('Task not found', 404);

		const column = await Column.findByPk(task.columnId);
		if (!column) throw new AppError('Column not found', 404);

		const hasRights = await this.canEditBoard(req.user, column.boardId);
		if (!hasRights) {
			throw new AppError('You do not have permission to edit this task', 403);
		}

		return next();
	});

	checkEditLabelRights = catchAsync(async (req, res, next) => {
		const labelId = req.params.id;
		const label = await Label.findByPk(labelId);
		if (!label) throw new AppError('Label not found', 404);

		const hasRights = await this.canEditBoard(req.user, label.boardId);
		if (!hasRights) {
			throw new AppError('You do not have permission to edit this label', 403);
		}

		return next();
	});

	checkEditCommentRights = catchAsync(async (req, res, next) => {
		if (isAdmin(req.user)) {
			return next();
		}

		const commentId = req.params.id;

		const comment = await Comment.findOne({
			where: { id: commentId, userId: req.user.id },
		});
		if (!comment) {
			return next(
				new AppError("Comment not found or you don't have permission", 404),
			);
		}

		return next();
	});

	getMe = catchAsync(async (req, res) => {
		const user = await User.findByPk(req.user.id);
		if (!user) {
			return next(new AppError('User not found', 404));
		}
		const { password, ...result } = user.dataValues;
		return res.status(200).json({ status: 'success', result });
	});

	// TODO: like authentication, but check if userId === userId of entity

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
