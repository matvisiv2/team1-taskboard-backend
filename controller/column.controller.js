class ColumnController {
	async createColumn (req, res) {
		// try {
		// 	const { title, board_id } = req.body;
		// 	const newColumn = await db.query(
		// 		'INSERT INTO columns (title, board_id) values ($1, $2) RETURNING *',
		// 		[title, board_id],
		// 	);
		// 	res.status(201).json(newColumn.rows[0]);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
	async getColumnsByBoard (req, res) {
		// try {
		// 	const board_id = req.params.board_id;
		// 	const columns = await db.query(
		// 		'SELECT * FROM columns WHERE board_id = $1',
		// 		[board_id],
		// 	);
		// 	res.json(columns.rows);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
	async getColumnsByBoardWithTasks (req, res) {
		// try {
		// 	const board_id = req.params.board_id;
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
		// 			LEFT JOIN tasks t ON c.id = t.column_id
		// 			WHERE c.board_id = $1
		// 			GROUP BY c.id, c.title
		// 			ORDER BY c.id;
		// 		`,
		// 		[board_id],
		// 	);
		// 	res.json(columns.rows);
		// } catch (err) {
		// 	console.log(err);
		// 	res.status(500).json({ error: 'Database error' });
		// }
	}
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
		// 	const { id, title, board_id } = req.body;
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
