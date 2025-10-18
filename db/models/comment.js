'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
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
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'comment',
	},
);
