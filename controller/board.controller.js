const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	board: Board,
	collaborator: Collaborator,
	column: Column,
} = require('../db/models');

class BoardController {
	createBoard = catchAsync(async (req, res, next) => {
		const body = req.body;

		const newBoard = await Board.create({
			title: body.title,
			userId: req.user.id,
		});

		if (!newBoard) {
			return next(new AppError('Failed to create new board', 400));
		}

		return res.status(201).json({
			status: 'success',
			result: newBoard.toJSON(),
		});
	});

	getAllBoards = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll({
			include: ['columns'],
			order: [[{ model: Column, as: 'columns' }, 'orderIndex', 'ASC']],
		});

		return res.status(200).json(boards);
	});

	getBoardsWithStatistics = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		if (!userId) {
			return next(new AppError('Need user id', 400));
		}

		const boardWithStatistics = await Board.findAll({
			where: { userId },
			include: ['columns'],
			order: [[{ model: Column, as: 'columns' }, 'orderIndex', 'ASC']],
		});

		return res.status(200).json(boardWithStatistics);
	});

	getBoardById = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		const boardId = req.params.id;

		const board = await Board.findByPk(boardId);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}

		return res.status(200).json(board);
	});

	updateBoard = catchAsync(async (req, res, next) => {
		const id = req.params.id;
		const userId = req.user.id;

		const board = await Board.findByPk(id);
		if (!board) {
			return next(new AppError('Invalid board id', 404));
		}

		board.title = req.body.title;
		await board.save();

		return res.status(200).json({
			status: 'success',
			result: board.toJSON(),
		});
	});

	deleteBoard = catchAsync(async (req, res, next) => {
		const deletedBoard = await Board.destroy({ where: { id: req.params.id } });
		if (!deletedBoard) {
			return next(new AppError('Board not found', 403));
		}

		return res.status(204).json({ message: 'Board successfully deleted'} );
	});
}

module.exports = new BoardController();
