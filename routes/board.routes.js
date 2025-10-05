const Router = require('express');
const router = new Router();
const boardController = require('../controller/board.controller');

router.post('/board', boardController.createBoard);
router.get('/boards/:user_id', boardController.getBoardsByUser);
router.get('/board/:id', boardController.getBoardById);
router.put('/board', boardController.updateBoard);
router.delete('/board/:id', boardController.deleteBoard);

module.exports = router;
