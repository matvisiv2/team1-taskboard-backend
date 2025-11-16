const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const collaboratorRouter = require('./collaborator.routes');
const boardRouter = require('./board.routes');
const columnRouter = require('./column.routes');
const taskRouter = require('./task.routes');
const commentRouter = require('./comment.routes');
const labelRouter = require('./label.routes');

module.exports = {
	authRouter,
	userRouter,
	collaboratorRouter,
	boardRouter,
	columnRouter,
	taskRouter,
	commentRouter,
	labelRouter,
};
