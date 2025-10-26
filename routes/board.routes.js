const Router = require('express');
const router = new Router();
const boardController = require('../controller/board.controller');
const authController = require('../controller/auth.controller');

router.post(
	'/board',
	authController.authentication,
	boardController.createBoard,
);
router.get(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.getBoardById,
);
router.get(
	'/boards',
	authController.authentication,
	boardController.getBoards,
);
router.get(
	'/boards-with-statistics',
	authController.authentication,
	boardController.getBoardsWithStatistics,
);
router.get(
	'/boards-all',
	authController.authentication,
	authController.checkAdminRights,
	boardController.getBoardsAll,
);
router.get(
	'/boards-all-with-statistics',
	authController.authentication,
	authController.checkAdminRights,
	boardController.getBoardsAllWithStatistics,
);
router.patch(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.updateBoard,
);
router.delete(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.deleteBoard,
);

module.exports = router;
