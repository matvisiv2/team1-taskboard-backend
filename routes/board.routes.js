const Router = require('express');
const router = new Router();
const boardController = require('../controller/board.controller');
const authController = require('../controller/auth.controller');

router.post('/board', authController.authentication, boardController.createBoard);
router.get('/boards-with-statistics', authController.authentication, boardController.getBoardsWithStatistics);
router.get('/board/:id', authController.authentication, boardController.getBoardById);
router.put('/board', authController.authentication, boardController.updateBoard);
router.delete('/board/:id', authController.authentication, boardController.removeBoard);

module.exports = router;
