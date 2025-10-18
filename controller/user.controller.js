const db = require('../db');

class UserController {
	async createUser (req, res) {
		try {
			const { email, firstName, lastName } = req.body;
			const newUser = await db.query(
				'INSERT INTO users (email, first_name, last_name) values ($1, $2, $3) RETURNING *',
				[email, firstName, lastName],
			);
			res.status(201).json(newUser.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async getUsers (req, res) {
		try {
			const users = await db.query('SELECT * FROM users');
			res.json(users.rows);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async getOneUser (req, res) {
		try {
			const id = req.params.id;
			const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
			res.json(user.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async updateUser (req, res) {
		try {
			const { id, email, firstName, lastName } = req.body;
			const user = await db.query(
				'UPDATE users set email = $1, first_name = $2, last_name = $3 WHERE id = $4 RETURNING *',
				[email, firstName, lastName, id],
			);
			res.json(user.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
	async deleteUser (req, res) {
		try {
			const id = req.params.id;
			const user = await db.query(
				'DELETE FROM users WHERE id = $1 RETURNING *',
				[id],
			);
			res.json(user.rows[0]);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
}

module.exports = new UserController();
