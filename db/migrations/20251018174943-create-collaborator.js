'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('collaborator', {
			userId: {
				type: Sequelize.INTEGER,
				references: { model: 'tuser', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			boardId: {
				type: Sequelize.INTEGER,
				references: { model: 'board', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('collaborator');
	},
};
