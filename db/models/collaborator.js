'use strict';
const { Model, Sequelize } = require('sequelize');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'collaborator',
	{
		userId: {
			type: Sequelize.INTEGER,
			references: { model: 'tuser', key: 'id' },
			onDelete: 'CASCADE',
			primaryKey: true,
		},
		boardId: {
			type: Sequelize.INTEGER,
			references: { model: 'board', key: 'id' },
			onDelete: 'CASCADE',
			primaryKey: true,
		},
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
		deletedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'collaborator',
	},
);
