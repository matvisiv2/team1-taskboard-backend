'use strict';
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../../config/database');
const column = require('./column');
const label = require('./column');

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

board.hasMany(column, { foreignKey: 'boardId' });
column.belongsTo(board, {
	foreignKey: 'boardId',
});

board.hasMany(label, { foreignKey: 'boardId' });
label.belongsTo(board, {
	foreignKey: 'boardId',
});

module.exports = board;
