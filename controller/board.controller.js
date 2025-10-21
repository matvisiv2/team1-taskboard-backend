const boardModel = require('../db/models/board');
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

		return res
			.status(201)
			.json({ status: 'success', result: newBoard.toJSON() });
		// try {
		// 	const { title, userId } = req.body;
		// 	const newBoard = await db.query(
		// 		'INSERT INTO boards (title, userId) values ($1, $2) RETURNING *',
		// 		[title, userId],
		// 	);
		// 	res.status(201).json(newBoard.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	});

	getBoardsByUser = catchAsync(async (req, res) => {
		const userId = req.params.userId;
		if (!userId) {
			return next(new AppError('Need user id', 400));
		}
		const boards = await boardModel.findAll({ where: { userId } });
		return res.status(200).json(boards);
	});

	getBoardsWithStatistics = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		if (!userId) {
			return next(new AppError('Need user id', 400));
		}
		const boardWithStatistics = await boardModel.findAll({ where: { userId } });
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

	async updateBoard (req, res) {
		// try {
		// 	const { id, title, userId } = req.body;
		// 	const board = await db.query(
		// 		'UPDATE boards SET title = $1 WHERE id = $2 RETURNING *',
		// 		[title, id],
		// 	);
		// 	res.json(board.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
	async removeBoard (req, res) {
		// try {
		// 	const id = req.params.id;
		// 	const board = await db.query(
		// 		'DELETE FROM boards WHERE id = $1 RETURNING *',
		// 		[id],
		// 	);
		// 	res.json(board.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
}

module.exports = new BoardController();
