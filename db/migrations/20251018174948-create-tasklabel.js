'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('tasklabel', {
			taskId: {
				type: Sequelize.INTEGER,
				references: { model: 'task', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			labelId: {
				type: Sequelize.INTEGER,
				references: { model: 'label', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('tasklabel');
	},
};
