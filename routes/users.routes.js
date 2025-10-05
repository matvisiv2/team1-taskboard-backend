const Router = require('express');
const router = new Router();
const usersController = require('../controller/users.controller');

router.post('/user', usersController.createUser);
router.get('/users', usersController.getUsers);
router.get('/user/:id', usersController.getOneUser);
router.put('/user', usersController.updateUser);
router.delete('/user/:id', usersController.deleteUser);

module.exports = router;
