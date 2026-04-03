const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/userController');
const { AuthRequestValidators, TokenAuth } = require('../../../middlewares');

const googleRoutes = require('./googleAuth');
const githubRoutes = require('./githubAuth');

// AUTH ROUTES
router.post('/signup',
    AuthRequestValidators.validateSignup,
    userController.signUp
);

router.get('/verify-email',
    userController.verifyEmail
);

router.post('/resend-verification',
    userController.reVerification
);


router.get('/login',
    AuthRequestValidators.validateSignin,
    userController.signIn
);

router.post('/refresh-token',
    TokenAuth.verifyRefreshToken,
    userController.refreshToken
);

router.get('/logout',
    TokenAuth.isAuthenticated,
    userController.logout
);

router.get('/logout-all',
    TokenAuth.isAuthenticated,
    userController.logoutAll
);



// OAuth
router.use('/google', googleRoutes);
router.use('/github', githubRoutes);

module.exports = router;