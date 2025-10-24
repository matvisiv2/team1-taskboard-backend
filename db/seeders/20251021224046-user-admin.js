const bcrypt = require('bcrypt');

module.exports = {
	up: (queryInterface, Sequelize) => {
		const passwordHash = bcrypt.hashSync(
			process.env.USER_PASSWORD_ADMIN || 'admin123',
			process.env.BCRYPT_ROUND || 10,
		);

		return queryInterface.bulkInsert('user', [
			{
				userType: process.env.USER_TYPE_SUPERADMIN || '2',
				firstName: 'John',
				lastName: 'Doe',
				email: process.env.USER_EMAIL_ADMIN || 'admin@gmail.com',
				password: passwordHash,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete(
			'user',
			{ userType: process.env.USER_TYPE_SUPERADMIN || '2' },
			{},
		);
	},
};
