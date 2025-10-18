'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('task', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			title: { type: Sequelize.STRING, allowNull: false },
			content: { type: Sequelize.STRING },
			done: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			archived: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			columnId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'column', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('task');
	},
};
