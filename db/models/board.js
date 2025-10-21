'use strict';
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../../config/database');

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

module.exports = board;
