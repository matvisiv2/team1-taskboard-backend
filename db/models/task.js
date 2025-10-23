const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const task = sequelize.define(
		'task',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			content: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			done: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			archived: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			orderIndex: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			columnId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'column', key: 'id' },
				onDelete: 'CASCADE',
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.fn('NOW'),
				allowNull: false,
			},
			deletedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			paranoid: true,
			freezeTableName: true,
			tableName: 'task',
			timestamps: true,
			modelName: 'task',
			indexes: [
				{
					unique: true,
					fields: ['columnId', 'orderIndex'],
				},
			],
			hooks: {
				// auto calc orderIndex
				async beforeCreate (task, options) {
					if (task.orderIndex == null) {
						const lastTask = await sequelize.models.task.findOne({
							where: { columnId: task.columnId },
							order: [['orderIndex', 'DESC']],
						});
						task.orderIndex = lastTask ? lastTask.orderIndex + 1 : 1;
					}
				},
				// reorder normalization
				async afterUpdate (task, options) {
					// if orderIndex changed — maybe, reorder
					if (task.changed('orderIndex')) {
						const column = await sequelize.models.column.findByPk(
							task.columnId,
						);

						// TODO: increase number of reorder count limit
						// if reorderCount more than 4 — normalize
						if (column && column.reorderCount >= 4) {
							const tasks = await sequelize.models.task.findAll({
								where: { columnId: task.columnId },
								order: [['orderIndex', 'ASC']],
							});

							// normalize orderIndex
							for (let i = 0; i < tasks.length; i++) {
								await tasks[i].update({ orderIndex: i + 1 }, { hooks: false });
							}

							await column.update({ reorderCount: 0 }); // reset reorderCount
							console.log(
								`Tasks orderIndex normalized for column ${column.id}`,
							);
						}
					}
				},
			},
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
