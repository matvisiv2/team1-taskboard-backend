/**
 * @swagger
 * tags:
 *   name: Label
 *   description: Label management routes (labels belong to boards)
 */

const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const LabelController = require('../controller/label.controller');

/**
 * @swagger
 * /label/{boardId}:
 *   post:
 *     summary: Create a new label
 *     description: Creates a label for a specific board.
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Board ID to which the label belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Urgent"
 *               color:
 *                 type: string
 *                 example: "#FF0000"
 *     responses:
 *       201:
 *         description: Label successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post(
	'/label/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	LabelController.createLabel,
);

/**
 * @swagger
 * /label/{id}:
 *   get:
 *     summary: Get a label by ID
 *     description: Returns a label by its ID.
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Label ID
 *     responses:
 *       200:
 *         description: Label found
 *       404:
 *         description: Label not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.getLabelById,
);

/**
 * @swagger
 * /labels/{boardId}:
 *   get:
 *     summary: Get all labels for a board
 *     description: Returns all labels belonging to a specific board.
 *     tags: [Label]
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
 *         description: List of labels
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/labels/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	LabelController.getLabelsByBoard,
);

/**
 * @swagger
 * /label/{id}:
 *   patch:
 *     summary: Update a label
 *     description: Updates an existing label.
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Label ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated label name"
 *               color:
 *                 type: string
 *                 example: "#00FF00"
 *     responses:
 *       200:
 *         description: Label updated
 *       404:
 *         description: Label not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.updateLabel,
);

/**
 * @swagger
 * /label/{id}:
 *   delete:
 *     summary: Delete a label
 *     description: Deletes a label by its ID.
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Label ID
 *     responses:
 *       200:
 *         description: Label deleted
 *       404:
 *         description: Label not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
	'/label/:id',
	AuthController.authentication,
	AuthController.checkEditLabelRights,
	LabelController.deleteLabel,
);

module.exports = router;
