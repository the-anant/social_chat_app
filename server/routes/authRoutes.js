const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');


router.post('/login', authController.user_login);
router.post('/googlelogin', authController.userLoginWithGoogle);
router.post('/register',authController.user_register);
router.post('/changepassword',authController.change_password);


module.exports = router;
