const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const LabelController = require('../controller/label.controller');

router.post(
	'/label/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	LabelController.createLabel,
);
router.get(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.getLabelById,
);
router.get(
	'/labels/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	LabelController.getLabelsByBoard,
);
router.put(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.updateLabel,
);
router.delete(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.deleteLabel,
);

module.exports = router;
