const catchAsync = require('../utils/catchAsync');

class UserController {
	createUser = catchAsync(async (req, res, next) => {
		// 	const { email, firstName, lastName } = req.body;
		// 	const newUser = await db.query(
		// 		'INSERT INTO users (email, first_name, last_name) values ($1, $2, $3) RETURNING *',
		// 		[email, firstName, lastName],
		// 	);
	});

	getUsers = catchAsync(async (req, res, next) => {
		// 	const users = await db.query('SELECT * FROM users');
		// 	res.json(users.rows);
	});

	getOneUser = catchAsync(async (req, res, next) => {
		// 	const id = req.params.id;
		// 	const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
		// 	res.json(user.rows[0]);
	});

	updateUser = catchAsync(async (req, res, next) => {
		// 	const { id, email, firstName, lastName } = req.body;
		// 	const user = await db.query(
		// 		'UPDATE users set email = $1, first_name = $2, last_name = $3 WHERE id = $4 RETURNING *',
		// 		[email, firstName, lastName, id],
	});

	deleteUser = catchAsync(async (req, res, next) => {
		// 	const id = req.params.id;
		// 	const user = await db.query(
		// 		'DELETE FROM users WHERE id = $1 RETURNING *',
		// 		[id],
		// 	);
	});
}

module.exports = new UserController();
