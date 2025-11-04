/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management (admin and profile actions)
 */

const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user (admin only)
 *     description: Admin can manually create a new user account.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
	'/user',
	authController.authentication,
	authController.checkAdminRights,
	userController.createUser,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Returns a list of all registered users.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
	'/users',
	authController.authentication,
	authController.checkAdminRights,
	userController.getUsers,
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     description: Returns user details by ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/user/:id',
	authController.authentication,
	authController.checkAdminRights,
	userController.getUserById,
);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user's info
 *     description: Allows the user or admin to update profile details.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               role:
 *                 type: string
 *                 example: "manager"
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/user/:id',
	authController.authentication,
	authController.checkEditUserRights,
	userController.updateUser,
);

/**
 * @swagger
 * /user/{id}/change-password:
 *   patch:
 *     summary: Change user's password
 *     description: Allows the user or admin to change password.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/user/:id/change-password',
	authController.authentication,
	authController.checkEditUserRights,
	userController.changePassword,
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Allows the admin or the user themself to delete their account.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
	'/user/:id',
	authController.authentication,
	authController.checkEditUserRights,
	userController.deleteUser,
);

module.exports = router;
