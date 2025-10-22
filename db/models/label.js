const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const label = sequelize.define(
		'label',
		{
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
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		},
		{
			paranoid: false,
			freezeTableName: true,
			tableName: 'label',
			timestamps: true,
			modelName: 'label',
		},
	);

	label.associate = (models) => {
		label.belongsTo(models.board, { foreignKey: 'boardId' });
		label.belongsToMany(models.task, {
			through: models.tasklabel,
			foreignKey: 'labelId',
			otherKey: 'taskId',
		});
	};

	return label;
};
