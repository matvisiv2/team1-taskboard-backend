const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

router.post(
	'/user',
	authController.authentication,
	authController.checkAdminRights,
	userController.createUser,
);
router.get(
	'/users',
	authController.authentication,
	authController.checkAdminRights,
	userController.getUsers,
);
router.get(
	'/user/:id',
	authController.authentication,
	authController.checkAdminRights,
	userController.getUserById,
);
router.put(
	'/user/:id',
	authController.authentication,
	authController.checkEditUserRights,
	userController.updateUser,
);
router.put(
	'/user/:id/change-password',
	authController.authentication,
	authController.checkEditUserRights,
	userController.changePassword,
);
router.delete(
	'/user/:id',
	authController.authentication,
	authController.checkEditUserRights,
	userController.deleteUser,
);

module.exports = router;
