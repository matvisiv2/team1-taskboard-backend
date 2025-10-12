const db = require('../db');

class BoardController {
	async createBoard (req, res) {
		try {
			const { title, user_id } = req.body;
			const newBoard = await db.query(
				'INSERT INTO boards (title, user_id) values ($1, $2) RETURNING *',
				[title, user_id],
			);
			res.json(newBoard.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async getBoardsByUser (req, res) {
		try {
			const userId = req.params.user_id;
			const boards = await db.query('SELECT * FROM boards WHERE user_id = $1', [
				userId,
			]);
			res.json(boards.rows);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async getBoardsByUserWithStatistics (req, res) {
		try {
			const userId = req.params.user_id;
			const boards = await db.query(
				`
					SELECT 
						b.id,
						b.title,
						b.user_id,
						b.created_at,
									b.updated_at,
						COUNT(DISTINCT c.id) AS column_count,
						COUNT(t.id) AS task_count
					FROM boards b
					LEFT JOIN columns c ON b.id = c.board_id
					LEFT JOIN tasks t ON c.id = t.column_id
					WHERE b.user_id = $1
					GROUP BY b.id, b.title, b.user_id, b.created_at, b.updated_at
					ORDER BY b.id;
				`,
				[userId],
			);
			res.json(boards.rows);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async getBoardById (req, res) {
		try {
			const id = req.params.id;
			const board = await db.query('SELECT * FROM boards WHERE id = $1', [id]);
			res.json(board.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async updateBoard (req, res) {
		try {
			const { id, title, user_id } = req.body;
			const board = await db.query(
				'UPDATE boards set title = $1 WHERE id = $2 RETURNING *',
				[title, id],
			);
			res.json(board.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async deleteBoard (req, res) {
		try {
			const id = req.params.id;
			const board = await db.query(
				'DELETE FROM boards WHERE id = $1 RETURNING *',
				[id],
			);
			res.json(board.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
}

module.exports = new BoardController();
