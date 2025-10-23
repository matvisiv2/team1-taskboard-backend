const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { board: Board, collaborator: Collaborator } = require('../db/models');

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

	getBoardsWithStatistics = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		if (!userId) {
			return next(new AppError('Need user id', 400));
		}

		const boardWithStatistics = await Board.findAll({
			where: { userId },
			include: ['columns'],
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

		// check if user is owner or collaborator
		if (board.userId !== userId) {
			const collaborator = await Collaborator.findOne({
				where: { boardId, userId },
			});
			if (!collaborator) {
				return next(
					new AppError('You do not have permission to access this board', 403),
				);
			}
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

		// check if user is owner or collaborator
		if (board.userId !== userId) {
			const isCollaborator = await Collaborator.findOne({
				where: { boardId: id, userId },
			});
			if (!isCollaborator) {
				return next(
					new AppError('You do not have permission to update this board', 403),
				);
			}
		}

		board.title = req.body.title;

		const updatedResult = await board.save();

		return res.status(200).json({
			status: 'success',
			result: updatedResult.toJSON(),
		});
	});

	deleteBoard = catchAsync(async (req, res, next) => {
		const id = req.params.id;
		const userId = req.user.id;

		const deletedBoard = await Board.destroy({ where: { id, userId } });

		if (!deletedBoard) {
			return next(
				new AppError(
					'Board not found or you do not have permission to delete this board',
					403,
				),
			);
		}

		return res.status(204).json({
			status: 'success',
			result: deletedBoard,
		});
	});
}

module.exports = new BoardController();
