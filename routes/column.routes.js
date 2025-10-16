const Router = require('express');
const router = new Router();
const columnController = require('../controller/column.controller');

router.post('/column', columnController.createColumn);
router.get('/columns/:board_id', columnController.getColumnsByBoard);
router.get('/columns-with-tasks/:board_id', columnController.getColumnsByBoardWithTasks);
router.get('/column/:id', columnController.getColumnById);
router.put('/column', columnController.updateColumn);
router.delete('/column/:id', columnController.removeColumn);

module.exports = router;
