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
		modelName: 'board',
	},
);
