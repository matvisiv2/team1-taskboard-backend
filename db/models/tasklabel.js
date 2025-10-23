const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const tasklabel = sequelize.define(
		'tasklabel',
		{
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
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
		},
		{
			paranoid: false,
			freezeTableName: true,
			tableName: 'tasklabel',
			timestamps: true,
			modelName: 'tasklabel',
		},
	);

	return tasklabel;
};
