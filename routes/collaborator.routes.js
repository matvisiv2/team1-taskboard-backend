/**
 * @swagger
 * tags:
 *   name: Collaborator
 *   description: Collaborators management (add and remove actions)
 */

const Router = require('express');
const router = new Router();
const collaboratorController = require('./../controller/collaborator.controller');
const authController = require('../controller/auth.controller');

/**
 * @swagger
 * /collaborator:
 *   post:
 *     summary: Add new collaborator to board.
 *     description: Owner or active collaborator can add new collaborator to a board.
 *     tags: [Collaborator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Collaborator added successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
	'/collaborator/:boardId/:userId',
	authController.authentication,
	authController.checkEditBoardRights,
	collaboratorController.createCollaborator,
);

module.exports = router;
