const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'secret_key_jwt', {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
};

module.exports = { generateToken };
