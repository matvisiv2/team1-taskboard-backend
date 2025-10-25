const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { board: Board, column: Column, task: Task } = require('../db/models');

class TaskController {
	createTask = catchAsync(async (req, res, next) => {
		const userId = req.user.id;
		const { boardId, columnId, title } = req.body;
		if (!title || !columnId) {
			return next(new AppError('Title and Task ID are required', 400));
		}

		// cheak if the user has access to the board
		const board = await Board.findByPk(boardId);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}
		if (board.userId != userId) {
			const isCollaborator = await board.hasCollaborators(userId);
			if (!isCollaborator) {
				return next(
					new AppError(
						'You do not have permission to add task to this board',
						403,
					),
				);
			}
		}

		const newTask = await Task.create({ title, columnId });

		return res.status(201).json({
			status: 'success',
			result: newTask,
		});
	});

	getTaskByIdWithLabelsAndComments = catchAsync(async (req, res, next) => {
		const id = req.params.id;

		const task = await Task.findByPk(id, {
			include: ['labels', 'comments'],
		});

		if (!task) {
			return next(new AppError('Task not found', 404));
		}

		return res.status(200).json(task);
	});

	// getTaskByIdWithLabels = catchAsync(async (req, res, next) => {});
	// getTasksByBoard = catchAsync(async (req, res, next) => {});

	updateTask = catchAsync(async (req, res, next) => {
		const id = req.params.id;

		const task = await Task.findByPk(id);
		if (!task) {
			return next(new AppError('Invalid task id', 404));
		}

		task.set(req.body);
		await task.save();
		if (req.body.orderIndex) {
			await Column.increment('reorderCount', { where: { id: task.columnId } });
		}

		return res.status(201).json({ status: 'success', result: task });
	});

	deleteTask = catchAsync(async (req, res, next) => {
		const id = req.params.id;

		const deletedTask = await Task.destroy({ where: { id } });

		if (!deletedTask) {
			return next(new AppError('Task not found', 404));
		}

		return res.status(204).json({ message: 'Task successfully deleted'} );
	});
}

module.exports = new TaskController();
