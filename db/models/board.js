'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
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
			references: { model: 'tuser', key: 'id' },
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
		modelName: 'board',
	},
);
