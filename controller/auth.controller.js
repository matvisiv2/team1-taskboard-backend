const db = require('../db');
const jwt = require('jsonwebtoken');
const t_user = require('../db/models/tuser');

class AuthController {
	async signUp (req, res) {
		try {
			const body = req.body;
			// TODO: hash the password
			// const token = jwt.sign(
			// 	{
			// 		email: body.email,
			// 		password: body.password,
			// 	},
			// 	'secret1',
			// );

			// TODO: check if user alreaty exist
			// const auth = await db.query('SELECT COUNT(*) FROM user WHERE email=$1', [
			// 	body.email,
			// ]);

			const newUser = await t_user.create({
				userType: '1',
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
				// TODO: password hash instead of clear password
				passwordHash: body.password,
			});

			if (!newUser) {
				return res.status(500).json({
					status: 'fail',
					message: 'Fail to create user.',
				});
			}

			return res.json({ stauts: 'success', data: newUser });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ stauts: 'fail', error: 'Database error' });
		}
	}
	async signIn (req, res) {
		try {
			const { email, password } = req.body;

			const token = jwt.sign(
				{
					email,
					password,
				},
				'secret1',
			);

			const auth = await db.query(
				'SELECT COUNT(*) FROM users WHERE email=$1 AND passwordHash=$2',
				[email, passwordHash],
			);
			if (auth.rowCount > 0) {
				res.json({ success: true, token: token });
			} else {
				res.status(401).json({ error: 'email and password do not match.' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: 'Database error' });
		}
	}
}

module.exports = new AuthController();
