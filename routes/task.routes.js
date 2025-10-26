const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const TaskController = require('../controller/task.controller');

router.post(
	'/task/:columnId',
	AuthController.authentication,
	AuthController.checkEditColumnRights,
	TaskController.createTask,
);
router.get(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.getTaskById,
);
router.get(
	'/task-full/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.getTaskByIdWithLabelsAndComments,
);
router.get(
	'/tasks',
	AuthController.authentication,
	AuthController.checkAdminRights,
	TaskController.getAllTasks,
);
router.get(
	'/tasks/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	TaskController.getAllTasksByBoard,
);
router.patch(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.updateTask,
);
router.delete(
	'/task/:id',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	TaskController.deleteTask,
);

module.exports = router;
