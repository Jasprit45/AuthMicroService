const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/userController');
const { TokenAuth, AuthRequestValidators } = require('../../../middlewares');
const profileRoutes = require('./profileRoutes');

router.get('/isAuthenticated',
    TokenAuth.isAuthenticated,
    userController.dummy
);

router.patch('/change-password',
    TokenAuth.isAuthenticated,
    AuthRequestValidators.validatePasswordChange,
    userController.changePassword
);

router.get('/',
    TokenAuth.isAuthenticated,
    TokenAuth.isManagerOrAdmin,
    userController.getAllUsers
);

router.use('/me',
    TokenAuth.isAuthenticated,
    profileRoutes
);

router.get('/:id',
    TokenAuth.isAuthenticated,
    TokenAuth.isManagerOrAdminOrSelf,
    userController.getUser
);

module.exports = router;