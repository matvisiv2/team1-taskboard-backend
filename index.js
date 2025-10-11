const express = require('express');
const db = require('./db');
const cors = require('cors');

const userRouter = require('./routes/user.routes');
const boardRouter = require('./routes/board.routes');

const SERVER_PORT = process.env.SERVER_PORT || 4444;
const DB_PORT = process.env.DB_PORT || 5432;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', userRouter);
app.use('/api', boardRouter);

async function startServer () {
	try {
		await db.query('SELECT NOW()');
		console.log(
			`DB running on port ${DB_PORT}. Connected to PostgreSQL successfully`,
		);

		app.listen(SERVER_PORT, () =>
			console.log(`server started on port ${SERVER_PORT}`),
		);
	} catch (err) {
		console.error(`DB connection failed: ${err.message}`);
		process.exit(1);
	}
}

startServer();
