const board = require('../db/models/board');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class BoardController {
	createBoard = catchAsync(async (req, res, next) => {
		const body = req.body;

		const newBoard = await board.create({
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
		const boards = await board.findAll({ where: { userId } });
		return res.status(200).json(boards);
	});

	getBoardsByUserWithStatistics = catchAsync(async (req, res, next) => {
		console.log('---------------------------', req.userFresh, '---------------------------');
		const userId = req.params.userId;
		if (!userId) {
			return next(new AppError('Need user id', 400));
		}
		const boardWithStatistics = await board.findAll({ where: { userId } });
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
		console.log(boardWithStatistics);
		return res.json(boardWithStatistics);
	});

	async getBoardById (req, res) {
		// try {
		// 	const id = req.params.id;
		// 	const board = await db.query('SELECT * FROM boards WHERE id = $1', [id]);
		// 	res.json(board.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
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
