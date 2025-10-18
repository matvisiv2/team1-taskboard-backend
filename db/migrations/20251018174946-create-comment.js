'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('comment', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			content: { type: Sequelize.STRING, allowNull: false },
			taskId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'task', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('comment');
	},
};
