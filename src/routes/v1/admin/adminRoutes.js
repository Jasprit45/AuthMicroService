const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/userController');
const { TokenAuth, AuthRequestValidators } = require('../../../middlewares');

// ROLE CHECK
router.get('/is-admin',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    (req, res) => res.json({ message: "Welcome Admin!!!" })
);

router.get('/is-manager',
    TokenAuth.isAuthenticated,
    TokenAuth.isManager,
    (req, res) => res.json({ message: "Welcome Manager!!!" })
);

// ROLE MANAGEMENT
router.patch('/make-admin',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    AuthRequestValidators.validateRoleChange,
    userController.makeAdmin
);

router.patch('/make-manager',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    AuthRequestValidators.validateRoleChange,
    userController.makeManager
);

module.exports = router;