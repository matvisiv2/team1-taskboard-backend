const boardModel = require('../db/models/board');
const userModel = require('../db/models/user');
const collaboratorModel = require('../db/models/collaborator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class BoardController {
	createBoard = catchAsync(async (req, res, next) => {
		const body = req.body;

		const newBoard = await boardModel.create({
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
		const boardWithStatistics = await boardModel.findAll({
			where: { userId },
			// include: userModel,
		});
		// const boards = await db.query(
		// 	`
		// 		SELECT
		// 			b.id,
		// 			b.title,
		// 			b.userId,
		// 			b.created_at,
		// 			b.updated_at,
		// 			COUNT(DISTINCT c.id) AS column_count,
		// 			COUNT(t.id) AS task_count
		// 		FROM boards b
		// 		LEFT JOIN columns c ON b.id = c.boardId
		// 		LEFT JOIN tasks t ON c.id = t.columnId
		// 		WHERE b.userId = $1
		// 		GROUP BY b.id, b.title, b.userId, b.created_at, b.updated_at
		// 		ORDER BY b.id;
		// 	`,
		// 	[userId],
		// );
		return res.status(200).json(boardWithStatistics);
	});

	getBoardById = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		const boardId = req.params.id;

		const board = await boardModel.findByPk(boardId);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}

		// check if user is owner or collaborator
		if (board.userId !== userId) {
			const collaborator = await collaboratorModel.findOne({
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
		const userId = req.user.id;
		const id = req.params.id;
		const title = req.body.title;

		const updatedBoard = (
			await boardModel.update(
				{ title },
				{ where: { id, userId }, returning: true },
			)
		)[1][0];

		if (!updatedBoard) {
			return next(
				new AppError(
					'Board not found or you do not have permission to update this board',
					404,
				),
			);
		}

		return res.status(200).json({
			status: 'success',
			result: updatedBoard.toJSON(),
		});
	});

	removeBoard = catchAsync(async (req, res, next) => {
		const id = req.params.id;
		const userId = req.user.id;

		const deletedBoard = await boardModel.destroy({ where: { id, userId } });

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
