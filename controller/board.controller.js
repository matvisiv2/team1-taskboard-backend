const Sequelize = require('sequelize');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	board: Board,
	collaborator: Collaborator,
	column: Column,
	task: Task,
	comment: Comment,
} = require('../db/models');
const { where } = require('sequelize');

class BoardController {
	createBoard = catchAsync(async (req, res, next) => {
		const newBoard = await Board.create({
			...req.body,
			userId: req.user.id,
		});

		if (!newBoard) {
			return next(new AppError('Failed to create new board', 400));
		}

		// add three default columns
		await Column.bulkCreate([
			{ title: 'To Do', boardId: newBoard.id, orderIndex: 1 },
			{ title: 'In Progress', boardId: newBoard.id, orderIndex: 2 },
			{ title: 'Done', boardId: newBoard.id, orderIndex: 3 },
		]);

		const createdBoard = await Board.findByPk(newBoard.id, {
			include: ['columns'],
			order: [[{ model: Column, as: 'columns' }, 'orderIndex', 'ASC']],
		});

		return res.status(201).json({
			status: 'success',
			result: createdBoard.toJSON(),
		});
	});

	getBoardById = catchAsync(async (req, res, next) => {
		const board = await Board.findByPk(req.params.id);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}

		return res.status(200).json(board);
	});

	getBoards = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll({
			where: { userId: req.user.id },
		});

		return res.status(200).json(boards);
	});

	getBoardsWithStatistics = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll({
			where: { userId: req.user.id },
			attributes: [
				'id',
				'title',
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns.id')),
					),
					'columnsCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns->tasks.id')),
					),
					'tasksCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn(
							'DISTINCT',
							Sequelize.col('columns->tasks->comments.id'),
						),
					),
					'commentsCount',
				],
			],
			include: [
				{
					model: Column,
					as: 'columns',
					attributes: [],
					include: [
						{
							model: Task,
							as: 'tasks',
							attributes: [],
							include: [
								{
									model: Comment,
									as: 'comments',
									attributes: [],
								},
							],
						},
					],
				},
			],
			group: ['board.id'],
			order: [['id', 'ASC']],
			subQuery: false,
		});

		return res.status(200).json(boards);
	});

	getBoardsAll = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll();
		return res.status(200).json(boards);
	});

	getBoardsAllWithStatistics = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll({
			attributes: [
				'id',
				'title',
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns.id')),
					),
					'columnsCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns->tasks.id')),
					),
					'tasksCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn(
							'DISTINCT',
							Sequelize.col('columns->tasks->comments.id'),
						),
					),
					'commentsCount',
				],
			],
			include: [
				{
					model: Column,
					as: 'columns',
					attributes: [],
					include: [
						{
							model: Task,
							as: 'tasks',
							attributes: [],
							include: [
								{
									model: Comment,
									as: 'comments',
									attributes: [],
								},
							],
						},
					],
				},
			],
			group: ['board.id'],
			order: [['id', 'ASC']],
			subQuery: false,
		});

		return res.status(200).json(boards);
	});

	updateBoard = catchAsync(async (req, res, next) => {
		const board = await Board.findByPk(req.params.id);
		if (!board) {
			return next(new AppError('Invalid board id', 404));
		}

		await board.update(req.body);

		return res.status(200).json({
			status: 'success',
			result: board.toJSON(),
		});
	});

	deleteBoard = catchAsync(async (req, res, next) => {
		await Board.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Board successfully deleted' });
	});
}

module.exports = new BoardController();
