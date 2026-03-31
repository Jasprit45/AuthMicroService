const express = require('express');
const router = express.Router();

const { TokenAuth,RateLimiter  } = require('../../../middlewares');
const userController = require('../../../controllers/userController');

router.get('',
    RateLimiter.sessionRateLimiter,
    userController.getMyProfile
);

router.patch('',
    userController.updateMyProfile
);

router.delete('',
    TokenAuth.verifyRefreshToken,
    userController.deleteMyAccount //delete the access and refresh token from the frontend 
);


module.exports = router;