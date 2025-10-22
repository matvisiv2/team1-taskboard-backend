const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const comment = sequelize.define(
		'comment',
		{
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			content: { type: Sequelize.STRING, allowNull: false },
			taskId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'task', key: 'id' },
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
			tableName: 'comment',
			timestamps: true,
			modelName: 'comment',
		},
	);

	comment.associate = (models) => {
		comment.belongsTo(models.task, { foreignKey: 'taskId' });
	};

	return comment;
};
