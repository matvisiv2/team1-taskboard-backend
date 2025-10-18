'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('board', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			title: { type: Sequelize.STRING, allowNull: false },
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'tuser', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('board');
	},
};
