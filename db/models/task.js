'use strict';
const { Sequelize } = require('sequelize');

const sequelize = require('../../config/database');
const comment = require('./comment');

const task = sequelize.define(
	'task',
	{
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		title: { type: Sequelize.STRING, allowNull: false },
		content: { type: Sequelize.STRING },
		done: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		archived: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		columnId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'column', key: 'id' },
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
		tableName: 'task',
		timestamps: true,
		modelName: 'task',
	},
);

task.hasMany(comment, { foreignKey: 'taskId' });
comment.belongsTo(task, {
	foreignKey: 'taskId',
});

module.exports = task;
