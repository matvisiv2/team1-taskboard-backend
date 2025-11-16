const { Sequelize, Op, literal } = require('sequelize');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	user: User,
	board: Board,
	collaborator: Collaborator,
	column: Column,
	task: Task,
	comment: Comment,
} = require('../db/models');

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

		return res.status(201).json(createdBoard);
	});

	getBoardById = catchAsync(async (req, res, next) => {
		const board = await Board.findByPk(req.params.id);
		if (!board) {
			return next(new AppError('Board not found', 404));
		}

		return res.status(200).json(board);
	});

	getBoardByIdWithLabelsAndCollaborators = catchAsync(
		async (req, res, next) => {
			const board = await Board.findByPk(req.params.id, {
				include: ['labels', 'collaborators'],
			});
			if (!board) {
				return next(new AppError('Board not found', 404));
			}

			return res.status(200).json(board);
		},
	);

	getBoards = catchAsync(async (req, res, next) => {
		const boards = await Board.findAll({
			where: {
				[Op.or]: [
					{ userId: req.user.id },
					literal(
						`id IN (SELECT "boardId" FROM collaborator WHERE "userId" = ${req.user.id})`,
					),
				],
			},
		});

		return res.status(200).json(boards);
	});

	getBoardsWithStatistics = catchAsync(async (req, res, next) => {
		const userId = req.user.id;

		const boards = await Board.findAll({
			where: {
				[Op.or]: [
					{ userId },
					literal(
						`"board"."id" IN (SELECT "collaborator"."boardId" FROM "collaborator" WHERE "collaborator"."userId" = ${userId})`,
					),
				],
			},
			attributes: [
				'id',
				'title',
				'createdAt',
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns.id')),
					),
					'columnCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns->tasks.id')),
					),
					'taskCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn(
							'DISTINCT',
							Sequelize.col('columns->tasks->comments.id'),
						),
					),
					'commentCount',
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
			raw: true,
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
					'columnCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('columns->tasks.id')),
					),
					'taskCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn(
							'DISTINCT',
							Sequelize.col('columns->tasks->comments.id'),
						),
					),
					'commentCount',
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

		return res.status(200).json(board);
	});

	deleteBoard = catchAsync(async (req, res, next) => {
		await Board.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Board successfully deleted' });
	});
}

module.exports = new BoardController();
