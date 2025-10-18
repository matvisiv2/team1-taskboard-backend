'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
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
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'tasklabel',
	},
);
