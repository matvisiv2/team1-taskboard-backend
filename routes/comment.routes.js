/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment management routes (comments belong to tasks)
 */

const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const CommentController = require('../controller/comment.controller');

/**
 * @swagger
 * /comment/{taskId}:
 *   post:
 *     summary: Create a new comment
 *     description: Creates a comment for a specific task.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID to which the comment belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This task looks great!"
 *     responses:
 *       201:
 *         description: Comment successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post(
	'/comment/:taskId',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	CommentController.createComment,
);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Returns a comment by its ID.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment found
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.getCommentById,
);

/**
 * @swagger
 * /comments/{taskId}:
 *   get:
 *     summary: Get all comments for a task
 *     description: Returns all comments belonging to a specific task.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of comments
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/comments/:taskId',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	CommentController.getCommentsByTask,
);

/**
 * @swagger
 * /comments-of-board/{boardId}:
 *   get:
 *     summary: Get all comments for a board
 *     description: Returns all comments from all tasks belonging to a board.
 *     tags: [Comment]
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
 *         description: List of comments for the board
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/comments-of-board/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	CommentController.getCommentsByBoard,
);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments (admin only)
 *     description: Returns all comments in the system. Admin access required.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/comments',
	AuthController.authentication,
	AuthController.checkAdminRights,
	CommentController.getAllComments,
);

/**
 * @swagger
 * /comment/{id}:
 *   patch:
 *     summary: Update a comment
 *     description: Updates a comment by its ID.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.updateComment,
);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment by its ID.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.deleteComment,
);

module.exports = router;
