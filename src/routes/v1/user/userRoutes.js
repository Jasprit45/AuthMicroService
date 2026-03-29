const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/userController');
const { TokenAuth, AuthRequestValidators } = require('../../../middlewares');

// AUTH CHECK
router.get('/isAuthenticated',
    TokenAuth.isAuthenticated,
    userController.dummy
);

// PASSWORD
router.patch('/change-password',
    TokenAuth.isAuthenticated,
    AuthRequestValidators.validatePasswordChange,
    userController.changePassword
);

// USERS
router.get('/',
    TokenAuth.isAuthenticated,
    TokenAuth.isManagerOrAdmin,
    userController.getAllUsers
);

router.get('/:id',
    TokenAuth.isAuthenticated,
    TokenAuth.isManagerOrAdminOrSelf,
    userController.getUser
);

module.exports = router;