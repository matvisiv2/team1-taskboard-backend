const bcrypt = require('bcrypt');

const AppError = require('../../utils/appError');
const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		'user',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			userType: {
				type: DataTypes.ENUM('0', '1', '2'),
				allowNull: false,
				defaultValue: '0',
				validate: {
					notNull: {
						msg: 'userType cannot be null',
					},
					notEmpty: {
						msg: 'userType cannot be empty',
					},
				},
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'firstName cannot be null',
					},
					notEmpty: {
						msg: 'firstName cannot be empty',
					},
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'lastName cannot be null',
					},
					notEmpty: {
						msg: 'lastName cannot be empty',
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'email cannot be null',
					},
					notEmpty: {
						msg: 'email cannot be empty',
					},
					isEmail: {
						msg: 'Invalid E-mail id',
					},
				},
			},
			password: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'password cannot be null',
					},
					notEmpty: {
						msg: 'password cannot be empty',
					},
				},
			},
			confirmPassword: {
				type: DataTypes.VIRTUAL,
				set (value) {
					if (this.password.length < (process.env.PASSWORD_MIN_LENGTH || 7)) {
						throw new AppError('Password length must be grater than 7', 400);
					}
					if (value === this.password) {
						const hashPassword = bcrypt.hashSync(
							value,
							Number(process.env.BCRYPT_ROUND) || 10,
						);
						this.setDataValue('password', hashPassword);
					} else {
						throw new AppError(
							'Password and comfirm password must be same',
							400,
						);
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
			tableName: 'user',
			timestamps: true,
			modelName: 'user',
		},
	);

	user.associate = (models) => {
		user.hasMany(models.board, { foreignKey: 'userId' });
		user.belongsToMany(models.board, {
			through: models.collaborator,
			foreignKey: 'userId',
			otherKey: 'boardId',
		});
	};

	return user;
};
