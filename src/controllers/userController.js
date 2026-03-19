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
const isAuthenticated = async (req,res) => {
    try {
        const token = req.headers['x-access-token'];
        // console.log(token);
        const response = await userService.isAuthenticated(token);
        console.log(response);
        return res.status(200).json({
            success: true,
            message:"user authenticated",
            data: response,
            error: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"User not authenticated",
            data: {},
            error: error,
        });
    }
}
const isAdmin = async (req,res) => {
    try {
        const response = await userService.isAdmin(req.body.userId);
        if(!response) {
            return res.status(200).json({
            success: true,
            message:"user is NOT an admin",
            data: response,
            error: {}
            });
        }
        return res.status(200).json({
            success: true,
            message:"user is admin",
            data: response,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            data: {},
            error: error,
        });
    }
}

const makeAdmin = async (req,res) => {
    try {
        const response = await userService.makeAdmin(req.body.userId);
        return res.status(200).json({
            success: true,
            message:"user is now an admin",
            data: response,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            data: {},
            error: error,
        });
    }
}
const isManager = async (req,res) => {
    try {
        const response = await userService.isManager(req.body.userId);
        if(!response) {
            return res.status(200).json({
            success: true,
            message:"user is NOT a Manager",
            data: response,
            error: {}
            });
        }
        return res.status(200).json({
            success: true,
            message:"user is a Manager",
            data: response,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            data: {},
            error: error,
        });
    }
}

const makeManager = async (req,res) => {
    try {
        const response = await userService.makeManager(req.body.userId);
        return res.status(200).json({
            success: true,
            message:"user is now a manager",
            data: response,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            data: {},
            error: error,
        });
    }
}
const changePassword = async (req,res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.updatePassword( token, req.body.oldPassword, req.body.newPassword);
        return res.status(200).json({
            success: true,
            message:"user Password is changed",
            data: response,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            data: {},
            error: error,
        });
    }
}


module.exports = {
    signUp,
    signIn,
    isAuthenticated,
    isAdmin,
    makeAdmin,
    isManager,
    makeManager,
    changePassword
}