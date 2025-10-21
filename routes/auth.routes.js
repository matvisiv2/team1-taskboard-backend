const Router = require('express');
const router = new Router();
const authController = require('../controller/auth.controller');

router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);
router.get('/auth/me', authController.authentication, authController.getMe);

module.exports = router;
