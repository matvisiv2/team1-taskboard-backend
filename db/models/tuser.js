'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('./../../config/database');

module.exports = sequelize.define(
	'tuser',
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		userType: { type: DataTypes.ENUM('0', '1', '2'), allowNull: false },
		firstName: { type: DataTypes.STRING, allowNull: false },
		lastName: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.TEXT, allowNull: false },
		confirmPassword: {
			type: DataTypes.VIRTUAL,
			set (value) {
				if (value === this.password) {
					const hashPassword = bcrypt.hashSync(value, 10);
					this.setDataValue('password', hashPassword);
				} else {
					throw new Error('Password and comfirm password must be same');
				}
			},
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
		deletedAt: { type: DataTypes.DATE },
	},
	{
		paranoid: true,
		freezeTableName: true,
		modelName: 'tuser',
	},
);
