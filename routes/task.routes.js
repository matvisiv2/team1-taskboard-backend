/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management (tasks belong to columns)
 */

const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const TaskController = require('../controller/task.controller');

/**
 * @swagger
 * /task/{columnId}:
 *   post:
 *     summary: Create a new task
 *     description: Creates a task inside a specific column.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Column ID to which the task belongs
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
 *                 example: "Implement user login"
 *               description:
 *                 type: string
 *                 example: "Add authentication with JWT and password hashing"
 *               orderIndex:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post(
	'/task/:columnId',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	TaskController.createTask,
);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns a task with its details.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.getTaskById,
);

/**
 * @swagger
 * /task-full/{id}:
 *   get:
 *     summary: Get a task with labels and comments
 *     description: Returns full task data including labels and comments.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found with related data
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/task-full/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.getTaskByIdWithLabelsAndComments,
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (admin only)
 *     description: Returns all tasks in the system (admin access required).
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
	'/tasks',
	AuthController.authentication,
	AuthController.checkAdminRights,
	TaskController.getAllTasks,
);

/**
 * @swagger
 * /tasks/{boardId}:
 *   get:
 *     summary: Get all tasks of a board
 *     description: Returns all tasks belonging to a specific board.
 *     tags: [Task]
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
 *         description: List of tasks for the board
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/tasks/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	TaskController.getAllTasksByBoard,
);

/**
 * @swagger
 * /task/{id}:
 *   patch:
 *     summary: Update a task (partial)
 *     description: Updates task fields such as title, description, or order.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               orderIndex:
 *                 type: number
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.updateTask,
);

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Replace a task (full update)
 *     description: Replaces all task data with new values.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Refactor task service"
 *               description:
 *                 type: string
 *                 example: "Simplify task controller logic"
 *               orderIndex:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Task replaced
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.put(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.updateTask,
);

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task by ID.
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.deleteTask,
);

module.exports = router;
