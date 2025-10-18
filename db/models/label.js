'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'label',
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		title: { type: Sequelize.STRING, allowNull: false },
		color: { type: Sequelize.STRING(50), allowNull: false },
		boardId: {
			type: Sequelize.INTEGER,
			references: { model: 'board', key: 'id' },
			onDelete: 'CASCADE',
			primaryKey: true,
		},
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: false,
		freezeTableName: true,
		modelName: 'label',
	},
);
