const Pool = require('pg').Pool;
const dotenv = require('dotenv');

dotenv.config();

const DB_PORT = process.env.DB_PORT || 5432;

const pool = new Pool({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: DB_PORT,
	database: 'team1_taskboard_db',
});

module.exports = pool;
