'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'collaborator',
	{
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'tuser', key: 'id' },
			onDelete: 'CASCADE',
			primaryKey: true,
		},
		boardId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'board', key: 'id' },
			onDelete: 'CASCADE',
			primaryKey: true,
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
		deletedAt: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'collaborator',
	},
);
