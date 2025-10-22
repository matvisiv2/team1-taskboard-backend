/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('column', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			title: { type: Sequelize.STRING, allowNull: false },
			boardId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'board', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
			deletedAt: { type: Sequelize.DATE },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('column');
	},
};
