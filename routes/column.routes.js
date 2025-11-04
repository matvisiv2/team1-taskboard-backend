/**
 * @swagger
 * tags:
 *   name: Column
 *   description: Column management routes (columns belong to boards)
 */
const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const ColumnController = require('../controller/column.controller');

/**
 * @swagger
 * /column/{boardId}:
 *   post:
 *     summary: Create a new column
 *     description: Creates a new column inside a board.
 *     tags: [Column]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board where the column will be created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "To Do"
 *               orderIndex:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Column successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post(
	'/column/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.createColumn,
);

/**
 * @swagger
 * /columns/{boardId}:
 *   get:
 *     summary: Get columns by board ID
 *     description: Returns all columns that belong to a specific board.
 *     tags: [Column]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board ID
 *     responses:
 *       200:
 *         description: List of columns
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */
router.get(
	'/columns/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.getColumnsByBoard,
);

/**
 * @swagger
 * /columns-with-tasks/{boardId}:
 *   get:
 *     summary: Get columns with their tasks by board ID
 *     description: Returns all columns of a board including their tasks.
 *     tags: [Column]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Columns with their tasks
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */
router.get(
	'/columns-with-tasks/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	ColumnController.getColumnsByBoardWithTasks,
);

/**
 * @swagger
 * /column/{id}:
 *   patch:
 *     summary: Update a column
 *     description: Updates a specific column by its ID.
 *     tags: [Column]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Column ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "In Progress"
 *               orderIndex:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Column updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
router.patch(
	'/column/:id',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	ColumnController.updateColumn,
);

/**
 * @swagger
 * /column/{id}:
 *   delete:
 *     summary: Delete a column
 *     description: Deletes a column by its ID.
 *     tags: [Column]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Column ID
 *     responses:
 *       200:
 *         description: Column successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
router.delete(
	'/column/:id',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	ColumnController.deleteColumn,
);

module.exports = router;
