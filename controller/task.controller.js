const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { board: Board, column: Column, task: Task } = require('../db/models');

class TaskController {
	createTask = catchAsync(async (req, res, next) => {
		if (!req.body.title) {
			return next(new AppError('Title is required', 400));
		}

		const newTask = await Task.create({
			...req.body,
			columnId: req.params.columnId,
		});

		return res.status(201).json({
			status: 'success',
			result: newTask,
		});
	});

	getTaskById = catchAsync(async (req, res, next) => {
		const task = await Task.findByPk(req.params.id);
		if (!task) {
			return next(new AppError('Task not found', 404));
		}

		return res.status(200).json(task);
	});

	getTaskByIdWithLabelsAndComments = catchAsync(async (req, res, next) => {
		const task = await Task.findByPk(req.params.id, {
			include: ['labels', 'comments'],
		});
		if (!task) {
			return next(new AppError('Task not found', 404));
		}

		return res.status(200).json(task);
	});

	getAllTasks = catchAsync(async (req, res, next) => {
		const tasks = await Task.findAll();
		return res.status(200).json(tasks);
	});

	getAllTasksByBoard = catchAsync(async (req, res, next) => {
		const tasks = await Task.findAll({
			include: [
				{
					model: Column,
					where: { boardId: req.params.boardId },
				},
			],
		});
		return res.status(200).json(tasks);
	});

	updateTask = catchAsync(async (req, res, next) => {
		const task = await Task.findByPk(req.params.id);
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
		await Task.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Task successfully deleted' });
	});
}

module.exports = new TaskController();
