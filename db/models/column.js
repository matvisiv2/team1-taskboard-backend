'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
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
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'column',
	},
);
