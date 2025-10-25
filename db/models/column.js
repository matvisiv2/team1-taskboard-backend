const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const column = sequelize.define(
		'column',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			boardId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'board', key: 'id' },
				onDelete: 'CASCADE',
			},
			orderIndex: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			reorderCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			taskCount: {
				type: DataTypes.VIRTUAL,
				get () {
					return this.getDataValue('taskCount') || 0;
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
			deletedAt: {
				type: Sequelize.DATE,
			},
		},
		{
			paranoid: true,
			freezeTableName: true,
			tableName: 'column',
			timestamps: true,
			modelName: 'column',
			indexes: [
				{
					unique: true,
					fields: ['boardId', 'orderIndex'],
				},
			],
			hooks: {
				// auto calc orderIndex
				async beforeCreate (column, options) {
					if (column.orderIndex == null) {
						const lastColumn = await sequelize.models.column.findOne({
							where: { boardId: column.boardId },
							order: [['orderIndex', 'DESC']],
						});
						column.orderIndex = lastColumn ? lastColumn.orderIndex + 1 : 1;
					}
				},
				// reorder normalization
				async afterUpdate (column, options) {
					// if orderIndex changed — maybe, reorder
					if (column.changed('orderIndex')) {
						const board = await sequelize.models.board.findByPk(column.boardId);

						// TODO: increase number of reorder count limit
						// if reorderCount more than N — normalize
						if (
							board &&
							board.reorderCount >= (process.env.DB_BOARD_REORDER_COUNT || 10)
						) {
							const columns = await sequelize.models.column.findAll({
								where: { boardId: column.boardId },
								order: [['orderIndex', 'ASC']],
							});

							// normalize orderIndex
							for (let i = 0; i < columns.length; i++) {
								await columns[i].update(
									{ orderIndex: i + 1 },
									{ hooks: false },
								);
							}

							await board.update({ reorderCount: 0 }); // reset reorderCount
							console.log(
								`Columns orderIndex normalized for board ${board.id}`,
							);
						}
					}
				},
			},
		},
	);

	column.afterFind(async (result, options) => {
		const { task } = sequelize.models;
		if (!result) return;

		const addCount = async (columnInstance) => {
			const count = await task.count({
				where: { columnId: columnInstance.id },
			});
			columnInstance.setDataValue('taskCount', count);
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
