const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const CommentController = require('../controller/comment.controller');

router.post(
	'/comment/:taskId',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	CommentController.createComment,
);
router.get(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.getCommentById,
);
router.get(
	'/comments/:taskId',
	AuthController.authentication,
	AuthController.checkEditTaskRights,
	CommentController.getCommentsByTask,
);
router.get(
	'/comments-of-board/:boardId',
	AuthController.authentication,
	AuthController.checkEditBoardRights,
	CommentController.getCommentsByBoard,
);
router.get(
	'/comments',
	AuthController.authentication,
	AuthController.checkAdminRights,
	CommentController.getAllComments,
);
router.put(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.updateComment,
);
router.delete(
	'/comment/:id',
	AuthController.authentication,
	AuthController.checkEditCommentRights,
	CommentController.deleteComment,
);

module.exports = router;
