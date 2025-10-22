const { Sequelize } = require('sequelize');

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
			tasksCount: {
				type: DataTypes.VIRTUAL,
				get () {
					return this.getDataValue('tasksCount') || 0;
				},
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

	column.afterFind(async (result, options) => {
		const { task } = sequelize.models;
		if (!result) return;

		const addCount = async (columnInstance) => {
			const count = await task.count({
				where: { columnId: columnInstance.id },
			});
			columnInstance.setDataValue('tasksCount', count);
		};

		if (Array.isArray(result)) {
			await Promise.all(result.map(addCount));
		} else {
			await addCount(result);
		}
	});

	column.associate = (models) => {
		column.belongsTo(models.board, { foreignKey: 'boardId' });
		column.hasMany(models.task, { foreignKey: 'columnId' });
	};

	return column;
};
