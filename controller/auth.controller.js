const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../db');
const tuser = require('../db/models/tuser');

const generateToken = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

class AuthController {
	async signUp (req, res) {
		try {
			const body = req.body;
			const newUser = await tuser.create({
				userType: '1',
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
				password: body.password,
				confirmPassword: body.confirmPassword,
			});

			const result = newUser.toJSON();

			delete result.password;
			delete result.deletedAt;

			result.token = generateToken({
				id: result.id,
			});

			return res.json({ status: 'success', result });
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ status: 'fail', message: 'Database error' });
		}
	}
	async signIn (req, res) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					status: 'fail',
					message: 'Please provide email and password',
				});
			}

			const result = await tuser.findOne({ where: { email } });

			if (!result || !(await bcrypt.compare(password, result.password))) {
				return res.status(401).json({
					status: 'fail',
					message: 'Incorrect mail or password',
				});
			}

			const token = generateToken({
				id: result.id,
			});

			return res.json({
				status: 'success',
				token,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: 'Database error' });
		}
	}
}

module.exports = new AuthController();
