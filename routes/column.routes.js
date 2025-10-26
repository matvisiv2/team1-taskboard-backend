const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const ColumnController = require('../controller/column.controller');

router.post(
	'/column/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.createColumn,
);
router.get(
	'/columns/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.getColumnsByBoard,
);
router.get(
	'/columns-with-tasks/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.getColumnsByBoardWithTasks,
);
router.patch(
	'/column/:id',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	ColumnController.updateColumn,
);
router.delete(
	'/column/:id',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	ColumnController.deleteColumn,
);

module.exports = router;
