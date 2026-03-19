const express = require('express');

const {signUp,signIn,isAuthenticated} = require('../../controllers/userController');
const {AuthRequestValidators} = require('../../middlewares/index');

const router  = express.Router();

router.post('/signup',
    AuthRequestValidators.validateSignup,
    signUp);

router.get('/login',
    AuthRequestValidators.validateSignin,
     signIn);
     
router.get('/isauthenticated',
     isAuthenticated);

module.exports = router;