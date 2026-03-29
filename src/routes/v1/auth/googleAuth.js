const express = require('express');

const GoogleAuthController = require('../../../controllers/googleAuthController');


const router = express.Router();

router.post('/',GoogleAuthController.googleLogin);



module.exports = router;