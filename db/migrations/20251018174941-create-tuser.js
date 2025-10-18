'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('tuser', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			userType: { type: Sequelize.ENUM('0', '1', '2'), allowNull: false },
			firstName: { type: Sequelize.STRING, allowNull: false },
			lastName: { type: Sequelize.STRING, allowNull: false },
			email: { type: Sequelize.STRING, allowNull: false, unique: true },
			passwordHash: { type: Sequelize.TEXT, allowNull: false },
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('tuser');
	},
};
