const express = require('express');

const userController = require('../../controllers/userController');
const {AuthRequestValidators} = require('../../middlewares/index');

const router  = express.Router();

router.post('/signup',
    AuthRequestValidators.validateSignup,
    userController.signUp);

router.get('/login',
    AuthRequestValidators.validateSignin,
    userController.signIn);

router.get('/isAuthenticated',
    userController.isAuthenticated);

router.get('/isAdmin',
    AuthRequestValidators.validateIsAdmin,
    userController.isAdmin);
    
router.post('/makeAdmin',
    AuthRequestValidators.validateMakeAdmin,
    userController.makeAdmin);

module.exports = router;