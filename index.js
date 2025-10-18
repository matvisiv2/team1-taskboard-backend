const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const db = require('./config/database');

dotenv.config();

const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const boardRouter = require('./routes/board.routes');
const columnRouter = require('./routes/column.routes');

const SERVER_PORT = process.env.SERVER_PORT || 4444;

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps us protect our app by setting various HTTP headers
app.use(morgan('dev')); // log the requests in console
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', boardRouter);
app.use('/api', columnRouter);

async function startServer () {
	try {
		await db.query('SELECT NOW()');
		console.log(
			`DB running on port ${db.options.port}. Connected to PostgreSQL successfully`,
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
