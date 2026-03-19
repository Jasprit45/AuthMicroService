const validateSignup = (req,res,next) => {
    if(!req.body.email || !req.body.password || !req.body.name){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing inputs",
            error: "inputs is/are missing"
        });
    }
    if(req.body.password.length < 6){
        return res.status(400).json({
            success: false,
            data : {},
            message: "password length should be at least of 6",
            error: "Password length is less than 6"
        });
    }
    next();
}
const validateSignin = (req,res,next) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing inputs",
            error: "inputs is/are missing"
        });
    }
    next();
}
const validateAthentication = (req,res,next) => {
    if(!req.headers['x-access-token']){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing input",
            error: "token is missing"
        });
    }
    next();
}
const validateRole = (req,res,next) => {
    if(!req.body.userId){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing input",
            error: "userId is missing"
        });
    }
    next();
}
const validatePasswordChange = (req,res,next) => {
    if( !req.body.newPassword || !req.body.oldPassword){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing input",
            error: "new/old Password is missing"
        });
    }
    // console.log( req.body.oldPassword < 6);
    if(req.body.newPassword.length < 6 || req.body.oldPassword.length < 6) {
        return res.status(400).json({
            success: false,
            data : {},
            message: "size of password should be at least 6",
            error: "new/old Password length is less than 6"
        });
    }
    next();
}



module.exports = {
    validateSignin,
    validateSignup,
    validateAthentication,
    validateRole,
    validatePasswordChange
}