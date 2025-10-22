const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { column: Column, board: Board } = require('../db/models');

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
		// try {
		// 	const { title, boardId } = req.body;
		// 	const newColumn = await db.query(
		// 		'INSERT INTO columns (title, boardId) values ($1, $2) RETURNING *',
		// 		[title, boardId],
		// 	);
		// 	res.status(201).json(newColumn.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	});

	async getColumnsByBoard (req, res) {
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
	}

	getColumnsByBoardWithTasks = catchAsync(async (req, res, next) => {
		const boardId = req.params.boardId;
		if (!boardId) {
			return next(new AppError('Board ID is required', 400));
		}
		const columns = await Column.findAll({
			where: { boardId },
		});

		return res.status(200).json({
			status: 'success',
			result: columns,
		});
		// try {
		// 	const boardId = req.params.boardId;
		// 	// TODO: check SQL request
		// 	const columns = await db.query(
		// 		`
		// 			SELECT
		// 				c.id AS id,
		// 				c.title AS title,
		// 				COALESCE(
		// 					JSON_AGG(
		// 					JSON_BUILD_OBJECT(
		// 						'id', t.id,
		// 						'title', t.title,
		// 						'content', t.content,
		// 						'created_at', t.created_at,
		// 						'updated_at', t.updated_at
		// 					)
		// 					) FILTER (WHERE t.id IS NOT NULL),
		// 					'[]'
		// 				) AS tasks
		// 			FROM columns c
		// 			LEFT JOIN tasks t ON c.id = t.columnId
		// 			WHERE c.boardId = $1
		// 			GROUP BY c.id, c.title
		// 			ORDER BY c.id;
		// 		`,
		// 		[boardId],
		// 	);
		// 	res.json(columns.rows);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	});

	async getColumnById (req, res) {
		// try {
		// 	const id = req.params.id;
		// 	const column = await db.query('SELECT * FROM columns WHERE id = $1', [
		// 		id,
		// 	]);
		// 	res.json(column.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
	async updateColumn (req, res) {
		// try {
		// 	const { id, title, boardId } = req.body;
		// 	const column = await db.query(
		// 		'UPDATE columns SET title = $1 WHERE id = $2 RETURNING *',
		// 		[title, id],
		// 	);
		// 	res.json(column.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
	async removeColumn (req, res) {
		// try {
		// 	const id = req.params.id;
		// 	const column = await db.query(
		// 		'DELETE FROM columns WHERE id = $1 RETURNING *',
		// 		[id],
		// 	);
		// 	res.json(column.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
}

module.exports = new ColumnController();
