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


module.exports = {
    validateSignin,
    validateSignup
}