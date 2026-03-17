const UserService = require('../service/userService');

const userService = new UserService();

const signUp = async (req,res) => {
    try {
        const user = await userService.signUp({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        return res.status(201).json({
            success: true,
            message:"User created",
            data: user,
            error: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"User not created",
            data: {},
            error: error
        });
    }
}
const signIn = async (req,res) => {
    try {
        const token = await userService.signIn(req.body.email,req.body.password);
        return res.status(200).json({
            success: true,
            message:"token created",
            token: token,
            error: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"User not signed in",
            token: {},
            error: error
        });
    }
}


module.exports = {
    signUp,
    signIn,
}