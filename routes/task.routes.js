const Router = require('express');
const router = new Router();
const AuthController = require('../controller/auth.controller');
const TaskController = require('../controller/task.controller');

router.post('/task', AuthController.authentication, TaskController.createTask);
router.get('/task/:id', AuthController.authentication, TaskController.getTaskByIdWithLabelsAndComments);
router.put('/task/:id', AuthController.authentication, TaskController.updateTask);
router.delete('/task/:id', AuthController.authentication, TaskController.deleteTask);

module.exports = router;
