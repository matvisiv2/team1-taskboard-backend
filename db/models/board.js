const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const board = sequelize.define(
		'board',
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
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'user', key: 'id' },
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
				type: Sequelize.DATE,
			},
		},
		{
			paranoid: true,
			freezeTableName: true,
			tableName: 'board',
			timestamps: true,
			modelName: 'board',
		},
	);

	board.associate = (models) => {
		board.belongsTo(models.user, { foreignKey: 'userId' });
		board.hasMany(models.column, { foreignKey: 'boardId' });
		board.hasMany(models.label, { foreignKey: 'boardId' });
		board.belongsToMany(models.user, {
			through: models.collaborator,
			foreignKey: 'boardId',
			otherKey: 'userId',
			as: 'collaborators',
		});
	};

	return board;
};
