const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { board: Board, column: Column, task: Task } = require('../db/models');
const { where } = require('sequelize');

class ColumnController {
	createColumn = catchAsync(async (req, res, next) => {
		const title = req.body.title;
		if (!title) {
			return next(new AppError('Title is required', 400));
		}

		const newColumn = await Column.create({
			title,
			boardId: req.params.boardId,
		});

		return res.status(201).json({
			status: 'success',
			result: newColumn,
		});
	});

	getColumnsByBoard = catchAsync(async (req, res, next) => {
		const columns = await Column.findAll({
			where: { boardId: req.params.boardId },
			order: [['orderIndex', 'ASC']],
		});

		return res.status(200).json(columns);
	});

	getColumnsByBoardWithTasks = catchAsync(async (req, res, next) => {
		const columns = await Column.findAll({
			where: { boardId: req.params.boardId },
			include: ['tasks'],
			order: [
				['orderIndex', 'ASC'],
				[{ model: Task, as: 'tasks' }, 'orderIndex', 'ASC'],
			],
		});

		return res.status(200).json(columns);
	});

	updateColumn = catchAsync(async (req, res, next) => {
		const column = await Column.findByPk(req.params.id);
		if (!column) {
			return next(new AppError('Column not found', 404));
		}

		column.set(req.body);
		await column.save();
		if (req.body.orderIndex) {
			await Board.increment('reorderCount', { where: { id: column.boardId } });
		}

		return res.status(200).json({ status: 'success', result: column });
	});

	deleteColumn = catchAsync(async (req, res, next) => {
		console.log('------deleteColumn');

		const column = await Column.destroy({ where: { id: req.params.id } });
		if (!column) {
			return next(new AppError('Column not found', 404));
		}
		console.log('------before return res');

		return res.status(204).json({ message: 'Column successfully deleted'} );
	});
}

module.exports = new ColumnController();
