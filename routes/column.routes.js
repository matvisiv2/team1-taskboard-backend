const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const ColumnController = require('../controller/column.controller');

router.post('/column', AuthController.authentication, ColumnController.createColumn);
router.get('/columns/:boardId', ColumnController.getColumnsByBoard);
router.get('/columns-with-tasks/:boardId', AuthController.authentication, ColumnController.getColumnsByBoardWithTasks);
router.get('/column/:id', ColumnController.getColumnById);
router.put('/column', ColumnController.updateColumn);
router.delete('/column/:id', ColumnController.deleteColumn);

module.exports = router;
