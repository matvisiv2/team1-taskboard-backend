const Router = require('express');
const router = new Router();
const columnController = require('../controller/column.controller');

router.post('/column', columnController.createColumn);
router.get('/columns/:boardId', columnController.getColumnsByBoard);
router.get('/columns-with-tasks/:boardId', columnController.getColumnsByBoardWithTasks);
router.get('/column/:id', columnController.getColumnById);
router.put('/column', columnController.updateColumn);
router.delete('/column/:id', columnController.removeColumn);

module.exports = router;
