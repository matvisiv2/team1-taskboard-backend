/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('comment', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			content: { type: Sequelize.STRING, allowNull: false },
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'user', key: 'id' },
				onDelete: 'CASCADE',
			},
			taskId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'task', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
			},
			deletedAt: { type: Sequelize.DATE },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('comment');
	},
};
