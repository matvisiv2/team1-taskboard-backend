/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('label', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			title: { type: Sequelize.STRING, allowNull: false },
			color: { type: Sequelize.STRING(50), allowNull: false },
			boardId: {
				type: Sequelize.INTEGER,
				references: { model: 'board', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
		});
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('label');
	},
};
