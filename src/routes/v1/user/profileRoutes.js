const express = require('express');
const router = express.Router();

const { TokenAuth,  } = require('../../../middlewares');
const userController = require('../../../controllers/userController');

router.get('',
    userController.getMyProfile
);

router.patch('',
    userController.updateMyProfile
);

router.delete('',
    TokenAuth.isRefreshToken,
    userController.deleteMyAccount //delete the access and refresh token from the frontend 
);


module.exports = router;