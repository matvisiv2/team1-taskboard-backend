const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { column: Column, board: Board } = require('../db/models');
const { where } = require('sequelize');

class ColumnController {
	createColumn = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		const { title, boardId } = req.body;
		if (!title || !boardId) {
			return next(new AppError('Title and Board ID are required', 400));
		}

		// cheak if the user has access to the board
		const board = await Board.findByPk(boardId);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}
		if (board.userId !== userId) {
			const isCollaborator = await board.hasCollaborators(userId);
			if (!isCollaborator) {
				return next(
					new AppError(
						'You do not have permission to add column to this board',
						403,
					),
				);
			}
		}

		const newColumn = await Column.create({
			title,
			boardId,
		});

		return res.status(201).json({
			status: 'success',
			result: newColumn,
		});
	});

	getColumnsByBoard = catchAsync(async (req, res, next) => {
		// try {
		// 	const boardId = req.params.boardId;
		// 	const columns = await db.query(
		// 		'SELECT * FROM columns WHERE boardId = $1',
		// 		[boardId],
		// 	);
		// 	res.json(columns.rows);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	});

	getColumnsByBoardWithTasks = catchAsync(async (req, res, next) => {
		const boardId = req.params.boardId;
		if (!boardId) {
			return next(new AppError('Board ID is required', 400));
		}
		const columns = await Column.findAll({
			where: { boardId },
			include: ['tasks'],
		});

		return res.status(200).json(columns);
	});

	updateColumn = catchAsync(async (req, res, next) => {
		const id = req.params.id;
		const { title } = req.body;

		const column = await Column.findByPk(id);
		if (!column) {
			return next(new AppError('Column not found', 404));
		}

		column.title = title || column.title;
		await column.save();

		return res.status(200).json({ status: 'success', result: column });
	});

	deleteColumn = catchAsync(async (req, res, next) => {
		const id = req.params.id;
		const column = await Column.destroy({ where: { id } });
		if (!column) {
			return next(new AppError('Column not found', 404));
		}

		return res.status(204).json({ status: 'success', data: column });
	});
}

module.exports = new ColumnController();
