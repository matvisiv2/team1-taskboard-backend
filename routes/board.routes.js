/**
 * @swagger
 * tags:
 *   name: Board
 *   description: Board management routes
 */

const Router = require('express');
const router = new Router();
const boardController = require('../controller/board.controller');
const authController = require('../controller/auth.controller');

/**
 * @swagger
 * /board:
 *   post:
 *     summary: Create a new board
 *     description: Creates a new board for the authenticated user.
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Project Board"
 *     responses:
 *       201:
 *         description: Board successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post(
	'/board',
	authController.authentication,
	boardController.createBoard,
);

/**
 * @swagger
 * /board/{id}:
 *   get:
 *     summary: Get a board by ID
 *     description: Returns board details by its ID.
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board found
 *       404:
 *         description: Board not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.getBoardById,
);

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all user boards
 *     description: Returns all boards owned by the authenticated user.
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user boards
 */
router.get('/boards', authController.authentication, boardController.getBoards);

/**
 * @swagger
 * /boards-with-statistics:
 *   get:
 *     summary: Get all user boards with statistics
 *     description: Returns all boards with additional statistics data.
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of boards with statistics
 */
router.get(
	'/boards-with-statistics',
	authController.authentication,
	boardController.getBoardsWithStatistics,
);

/**
 * @swagger
 * /boards-all:
 *   get:
 *     summary: Get all boards (admin only)
 *     description: Returns all boards in the system (admin access required).
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All boards
 *       403:
 *         description: Forbidden
 */
router.get(
	'/boards-all',
	authController.authentication,
	authController.checkAdminRights,
	boardController.getBoardsAll,
);

/**
 * @swagger
 * /boards-all-with-statistics:
 *   get:
 *     summary: Get all boards with statistics (admin only)
 *     description: Returns all boards with statistics (requires admin access).
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Boards with statistics
 *       403:
 *         description: Forbidden
 */
router.get(
	'/boards-all-with-statistics',
	authController.authentication,
	authController.checkAdminRights,
	boardController.getBoardsAllWithStatistics,
);

/**
 * @swagger
 * /board/{id}:
 *   patch:
 *     summary: Update a board
 *     description: Updates board data by ID (requires edit rights).
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Board Name"
 *     responses:
 *       200:
 *         description: Board updated
 *       404:
 *         description: Board not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.updateBoard,
);

/**
 * @swagger
 * /board/{id}:
 *   delete:
 *     summary: Delete a board
 *     description: Deletes a board by its ID (requires edit rights).
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Board deleted
 *       404:
 *         description: Board not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
	'/board/:id',
	authController.authentication,
	authController.checkEditBoardRights,
	boardController.deleteBoard,
);

module.exports = router;
