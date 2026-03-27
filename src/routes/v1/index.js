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

router.post('/refresh-token',
    TokenAuth.isRefreshToken,
    userController.refreshToken
);

router.get('/isAuthenticated',
    TokenAuth.isAuthenticated,
    userController.dummy
);


router.patch('/admin/make-admin',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    AuthRequestValidators.validateRoleChange,
    userController.makeAdmin 
);

router.get('/is-admin',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    (req,res)=> {
        res.json({message: "Welcome Admin!!!"});
    }
);

router.get('/is-manager',
    TokenAuth.isAuthenticated,
    TokenAuth.isManager,
    (req,res)=> {
        res.json({message: "Welcome Manager!!!"});
    }
);

router.patch('/admin/make-manager',
    TokenAuth.isAuthenticated,
    TokenAuth.isAdmin,
    AuthRequestValidators.validateRoleChange,
    userController.makeManager  
);

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