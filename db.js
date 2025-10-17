const Pool = require('pg').Pool;
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
	user: process.env.PG_USER || 'postgres',
	password: process.env.PG_PASSWORD || 'postgres',
	host: process.env.PG_HOST || 'localhost',
	port: process.env.PG_PORT || 5432,
	database: process.env.PG_DATABASE || 'team1_taskboard_db',
});

module.exports = pool;
