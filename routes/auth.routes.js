const Router = require('express');
const router = new Router();
const authController = require('../controller/auth.controller');

router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);

module.exports = router;
