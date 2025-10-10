const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: 5432,
	database: 'team1_taskboard_db',
});

module.exports = pool;
