const express = require('express');

const userController = require('../../controllers/userController');
const {AuthRequestValidators , TokenAuth} = require('../../middlewares/index');
 
const router  = express.Router();

router.post('/signup',
    AuthRequestValidators.validateSignup,
    userController.signUp
);

router.get('/login',
    AuthRequestValidators.validateSignin,
    userController.signIn
);


// router.get('/is-admin',
//     AuthRequestValidators.validateRole,
//     userController.isAdmin);
    
// router.post('/make-admin',
//     AuthRequestValidators.validateRole,
//     userController.makeAdmin);
// router.get('/is-manager',
//     AuthRequestValidators.validateRole,
//     userController.isManager);

// router.post('/make-manager',
//     AuthRequestValidators.validateRole,
//     userController.makeManager);

router.patch('/change-password',
    TokenAuth.isAuthenticated,
    AuthRequestValidators.validatePasswordChange,
    userController.changePassword
);

router.get('/logout',
    TokenAuth.isAuthenticated,
    userController.logout
);

module.exports = router;