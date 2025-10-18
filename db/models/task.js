'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('../../config/database');

module.exports = sequelize.define(
	'task',
	{
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		title: { type: Sequelize.STRING, allowNull: false },
		content: { type: Sequelize.STRING },
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
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'task',
	},
);
