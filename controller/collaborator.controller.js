const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { user: User } = require('../db/models');
const { board: Board } = require('../db/models');
const { collaborator: Collaborator } = require('../db/models');
const { isAdmin } = require('../utils/userHelpers');
const { Op, literal } = require('sequelize');

class CollaboratorController {
	createCollaborator = catchAsync(async (req, res, next) => {
		const data = { userId: req.params.userId, boardId: req.params.boardId };
		console.log(data);
		const newCollaborator = await Collaborator.create(data);
		if (!newCollaborator) {
			return next(new AppError('Failed to create collaborator', 500));
		}
		return res.status(201).json(newCollaborator);
	});

	// getCollaborators = catchAsync(async (req, res, next) => {
	// 	const collaborators = await Collaborator.findAll();
	// 	if (!collaborators) {
	// 		return next(new AppError('No collaborators found', 404));
	// 	}
	// 	return res.status(200).json(collaborators);
	// });

	// getCollaboratorsToCollaborate = catchAsync(async (req, res, next) => {
	// 	const currentBoardId = req.params.boardId;
	// 	const text = req.params.text || '';

	// 	// 1. Get owner ID
	// 	const board = await Board.findByPk(currentBoardId, {
	// 		attributes: ['collaboratorId'],
	// 	});

	// 	const ownerId = board.collaboratorId;

	// 	// 2. Get collaborator IDs
	// 	const collaborators = await Collaborator.findAll({
	// 		attributes: ['collaboratorId'],
	// 		where: { boardId: currentBoardId },
	// 		raw: true,
	// 	});

	// 	const excludedIds = [ownerId, ...collaborators.map((c) => c.collaboratorId)];

	// 	// 3. Advanced search token
	// 	const tokens = text
	// 		.toLowerCase()
	// 		.split(' ')
	// 		.filter((t) => t.length > 0);

	// 	// (firstName LIKE token OR lastName LIKE token)
	// 	const tokenConditions = tokens.map((token) => ({
	// 		[Op.or]: [
	// 			{ firstName: { [Op.iLike]: `%${token}%` } },
	// 			{ lastName: { [Op.iLike]: `%${token}%` } },
	// 			{ email: { [Op.iLike]: `%${token}%` } },
	// 		],
	// 	}));

	// 	// Relevance score
	// 	// more accurate - higher rating
	// 	const relevanceSQL = `
	// 		(CASE
	// 		WHEN LOWER("firstName") = '${text}' THEN 100
	// 		WHEN LOWER("lastName") = '${text}' THEN 100
	// 		WHEN LOWER("email") = '${text}' THEN 100

	// 		WHEN LOWER("firstName") LIKE '${text}%' THEN 90
	// 		WHEN LOWER("lastName") LIKE '${text}%' THEN 90
	// 		WHEN LOWER("email") LIKE '${text}%' THEN 90

	// 		WHEN LOWER("firstName") LIKE '%${text}%' THEN 60
	// 		WHEN LOWER("lastName") LIKE '%${text}%' THEN 60
	// 		WHEN LOWER("email") LIKE '%${text}%' THEN 60

	// 		ELSE 0
	// 		END) AS relevance
	// 	`;

	// 	// 4. Query eligible collaborators directly in DB
	// 	const collaborators = await Collaborator.findAll({
	// 		attributes: [
	// 			'id',
	// 			'firstName',
	// 			'lastName',
	// 			'email',
	// 			literal(relevanceSQL),
	// 		],
	// 		where: {
	// 			id: { [Op.notIn]: excludedIds },
	// 			...(tokens.length > 0 ? { [Op.and]: tokenConditions } : {}),
	// 		},
	// 		order: [literal('relevance DESC')],
	// 		limit: 5,
	// 		raw: true,
	// 	});

	// 	return res.status(200).json(collaborators);
	// });

	// getCollaboratorById = catchAsync(async (req, res, next) => {
	// 	const collaborator = await Collaborator.findByPk(req.params.id);
	// 	if (!collaborator) {
	// 		return next(new AppError('Collaborator not found', 404));
	// 	}
	// 	return res.status(200).json(collaborator);
	// });

	// updateCollaborator = catchAsync(async (req, res, next) => {
	// 	const collaboratorData = req.body;

	// 	if (req.collaborator.id != req.params.id) {
	// 		if (!isAdmin(collaborator)) {
	// 			return next(
	// 				new AppError('You do not have permission to update this collaborator', 403),
	// 			);
	// 		}
	// 	}

	// 	if (req.collaborator.id == req.params.id) {
	// 		collaboratorData.collaboratorType = req.collaborator.collaboratorType; // Prevent collaborator from changing their own collaboratorType
	// 	}

	// 	const collaborator = await Collaborator.findByPk(req.params.id);
	// 	if (!collaborator) {
	// 		return next(new AppError('Collaborator not found', 404));
	// 	}

	// 	await collaborator.update({
	// 		collaboratorType: collaboratorData.collaboratorType,
	// 		firstName: collaboratorData.firstName,
	// 		lastName: collaboratorData.lastName,
	// 		email: collaboratorData.email,
	// 	});

	// 	return res.status(200).json(collaborator);
	// });

	// // TODO: Implement change collaborator email functionality

	// changePassword = catchAsync(async (req, res, next) => {
	// 	const collaborator = await Collaborator.findByPk(req.params.id);
	// 	if (!collaborator) {
	// 		return next(new AppError('Collaborator not found', 404));
	// 	}

	// 	const checkOldPassword = await bcrypt.compare(
	// 		req.body.oldPassword,
	// 		collaborator.password,
	// 	);
	// 	if (!checkOldPassword) {
	// 		return next(new AppError('Incorrect old password', 401));
	// 	}

	// 	await collaborator.update({
	// 		password: req.body.newPassword,
	// 		confirmPassword: req.body.confirmPassword,
	// 	});

	// 	return res.status(200).json({ message: 'Password changed successfully' });
	// });

	// deleteCollaborator = catchAsync(async (req, res, next) => {
	// 	await Collaborator.destroy({ where: { id: req.params.id } });
	// 	return res.status(204).json({ message: 'Collaborator successfully deleted' });
	// });
}

module.exports = new CollaboratorController();
