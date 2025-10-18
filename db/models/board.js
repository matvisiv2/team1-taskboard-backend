'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'board',
	{
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		title: { type: Sequelize.STRING, allowNull: false },
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'tuser', key: 'id' },
			onDelete: 'CASCADE',
		},
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'board',
	},
);
