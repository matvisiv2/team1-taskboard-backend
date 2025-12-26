const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

const sequelize = new Sequelize(config);
// const sequelize = new Sequelize(process.env.DATABASE_URL, config);

module.exports = sequelize;
