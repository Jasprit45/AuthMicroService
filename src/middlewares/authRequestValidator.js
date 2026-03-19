const validateSignup = (req,res,next) => {
    if(!req.body.email || !req.body.password || !req.body.name){
        return res.status(400).json({
            success: false,
            data : {},
            message: "missing inputs",
            error: "inputs is/are missing"
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
const validateIsAdmin = (req,res,next) => {
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
const validateMakeAdmin = (req,res,next) => {
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


module.exports = {
    validateSignin,
    validateSignup,
    validateIsAdmin,
    validateMakeAdmin
}