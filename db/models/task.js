const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const task = sequelize.define(
		'task',
		{
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			title: { type: Sequelize.STRING, allowNull: false,  defaultValue: '', },
			content: { type: Sequelize.STRING, defaultValue: '', },
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
			tableName: 'task',
			timestamps: true,
			modelName: 'task',
		},
	);

	task.associate = (models) => {
		task.belongsTo(models.column, { foreignKey: 'columnId' });
		task.hasMany(models.comment, { foreignKey: 'taskId' });
		task.belongsToMany(models.label, {
			through: models.tasklabel,
			foreignKey: 'taskId',
			otherKey: 'labelId',
		});
	};

	return task;
};
