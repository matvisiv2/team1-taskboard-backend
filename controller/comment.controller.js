const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	board: Board,
	column: Column,
	task: Task,
	comment: Comment,
} = require('../db/models');

class CommentController {
	createComment = catchAsync(async (req, res, next) => {
		if (!req.body.content) {
			return next(new AppError('Content is required', 400));
		}

		const newComment = await Comment.create({
			...req.body,
			taskId: req.params.taskId,
			userId: req.user.id,
		});

		return res.status(201).json({
			status: 'success',
			result: newComment,
		});
	});

	getCommentById = catchAsync(async (req, res, next) => {
		const comment = await Comment.findByPk(req.params.id);
		if (!comment) {
			return next(new AppError('Comment not found', 404));
		}

		return res.status(200).json(comment);
	});

	getCommentsByTask = catchAsync(async (req, res, next) => {
		const comment = await Comment.findAll({
			where: { taskId: req.params.taskId },
		});
		if (!comment) {
			return next(new AppError('Comment not found', 404));
		}

		return res.status(200).json(comment);
	});

	getCommentsByBoard = catchAsync(async (req, res, next) => {
		const comments = await Comment.findAll({
			include: [
				{
					model: Task,
					as: 'task',
					include: [
						{
							model: Column,
							as: 'column',
							include: [
								{
									model: Board,
									as: 'board',
									where: { id: req.params.boardId },
								},
							],
						},
					],
				},
			],
		});

		return res.status(200).json(comments);
	});

	getAllComments = catchAsync(async (req, res, next) => {
		const comments = await Comment.findAll();
		return res.status(200).json(comments);
	});

	updateComment = catchAsync(async (req, res, next) => {
		const comment = await Comment.findByPk(req.params.id);
		if (!comment) {
			return next(new AppError('Invalid comment id', 404));
		}

		await comment.update(req.body);

		return res.status(201).json({ status: 'success', result: comment });
	});

	deleteComment = catchAsync(async (req, res, next) => {
		await Comment.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Comment successfully deleted' });
	});
}

module.exports = new CommentController();
