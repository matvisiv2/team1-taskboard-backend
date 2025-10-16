const Router = require('express');
const router = new Router();
const boardController = require('../controller/board.controller');

router.post('/board', boardController.createBoard);
router.get('/boards/:user_id', boardController.getBoardsByUser);
router.get('/boards-with-statistics/:user_id', boardController.getBoardsByUserWithStatistics);
router.get('/board/:id', boardController.getBoardById);
router.put('/board', boardController.updateBoard);
router.delete('/board/:id', boardController.removeBoard);

module.exports = router;
