const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const column = sequelize.define(
		'column',
		{
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			title: { type: Sequelize.STRING, allowNull: false },
			boardId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'board', key: 'id' },
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
		},
		{
			paranoid: true,
			freezeTableName: true,
			tableName: 'column',
			timestamps: true,
			modelName: 'column',
		},
	);

	column.associate = (models) => {
		column.belongsTo(models.board, { foreignKey: 'boardId' });
		column.hasMany(models.task, { foreignKey: 'columnId' });
	};

	return column;
};
