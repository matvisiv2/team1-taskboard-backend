'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'tuser',
	{
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		userType: { type: Sequelize.ENUM('0', '1', '2'), allowNull: false },
		firstName: { type: Sequelize.STRING, allowNull: false },
		lastName: { type: Sequelize.STRING, allowNull: false },
		email: { type: Sequelize.STRING, allowNull: false, unique: true },
		passwordHash: { type: Sequelize.TEXT, allowNull: false },
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'tuser',
	},
);
