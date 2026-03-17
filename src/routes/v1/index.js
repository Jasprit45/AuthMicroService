const express = require('express');

const {signUp,signIn} = require('../../controllers/userController');

const router  = express.Router();

router.post('/signup',signUp);

router.get('/login', signIn);

module.exports = router;