const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/userController');

router.get('',
    userController.getMyProfile
);

router.patch('',
    userController.updateMyProfile
);


module.exports = router;