const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { board: Board, label: Label, task: Task } = require('../db/models');
const { where } = require('sequelize');

class LabelController {
	createLabel = catchAsync(async (req, res, next) => {
		const title = req.body.title;
		if (!title) {
			return next(new AppError('Title is required', 400));
		}

		const newLabel = await Label.create({
			title,
			boardId: req.params.boardId,
		});

		return res.status(201).json({
			status: 'success',
			result: newLabel,
		});
	});

	getLabelById = catchAsync(async (req, res, next) => {
		const label = await Label.findByPk({ id: req.params.id });
		if (!label) {
			return next(new AppError('Label not found', 404));
		}
		return res.status(200).json(label);
	});

	getLabelsByBoard = catchAsync(async (req, res, next) => {
		const labels = await Label.findAll({
			where: { boardId: req.params.boardId },
		});
		return res.status(200).json(labels);
	});

	updateLabel = catchAsync(async (req, res, next) => {
		const label = await Label.findByPk(req.params.id);
		if (!label) {
			return next(new AppError('Label not found', 404));
		}

		label.set(req.body);
		await label.save();

		return res.status(200).json({ status: 'success', result: label });
	});

	deleteLabel = catchAsync(async (req, res, next) => {
		await Label.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Label successfully deleted' });
	});
}

module.exports = new LabelController();
