const catchAsync = require('../utils/catchAsync');
const { user: User } = require('../db/models');

class UserController {
	createUser = catchAsync(async (req, res, next) => {
		const newUser = await User.create(req.body);
		if (!newUser) {
			return next(new AppError('Failed to create user', 500));
		}
		return res.status(201).json(newUser);
	});

	getUsers = catchAsync(async (req, res, next) => {
		const users = await User.findAll();
		return res.status(200).json(users);
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
