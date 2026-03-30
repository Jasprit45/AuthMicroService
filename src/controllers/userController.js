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
            token,
            error: {}
        });

    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"User not signed in",
            error: error
        });
    }
}

const refreshToken = async (req,res) => {
    try {
        const response = await userService.assignNewAccessToken(req.user.refreshToken, req.user.id);
        return res.status(200).json({
            success: true,
            message:"token created",
            accessToken : response.accessToken,
            refreshToken : response.refreshToken,
            error: {}
        });

    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"User not signed in",
            error: error
        });
    }
}

const makeAdmin = async (req,res) => {
    try {
        const response = await userService.makeAdmin(req.user.id, req.body.email);
        return res.status(200).json({
            success: true,
            message:`${req.body.email} is now an Admin`,
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
        const response = await userService.makeManager(req.user.id, req.body.email);
        return res.status(200).json({
            success: true,
            message:`${req.body.email} is now a Manager`,
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
        const response = await userService.updatePassword( req.user.id , req.body.oldPassword, req.body.newPassword);
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
const logout = async (req,res) => {
    try {
        const refreshToken = req.headers['refresh-token'];
        // console.log(refreshToken);
        if(!refreshToken) return res.status(401).json({message: "Refresh Token not found"});

        //remove accessToken and refresh token from user(cookies, localstorage)
        //delete refreshToken from db

        const response = await userService.logout(refreshToken);

        return res.status(200).json({
            success: response.success,
            message:response.message,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const logoutAll = async (req,res) => {
    try {
        
        //remove accessToken from user(cookies, localstorage)
        //delete userid  from tokendb
        const response = await userService.logoutAll(req.user.id);

        return res.status(200).json({
            success: response,
            message:"Logged-Out",
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}

const dummy = async (req,res) => {
    try {
        return res.status(200).json({
            success: true,
            message:"DONE",
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const getAllUsers = async (req,res) => {
    try {
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 3,
            role: req.query.role,
            search: req.query.search //a part of email {ex. gmail}
        };
        const users = await userService.getAllUsers(query);
        return res.status(200).json({
            success: true,
            message:"Fetched All users",
            users,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const getUser = async (req,res) => {
    try {
        
        const user = await userService.getUser(req.params.id);
        return res.status(200).json({
            success: true,
            message:"Fetched  user",
            data : user,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const getMyProfile = async (req,res) => {
    try {
        const user = await userService.getMyProfile(req.user.id);
        return res.status(200).json({
            success: true,
            message:"Fetched  myinfo",
            data : user,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer");
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const updateMyProfile = async (req,res) => {
    try {
        if(!req.body) return res.status(400).json({message:"Not having anything to update in body"});
        const allowedUpdate = {
            name: req.body.name
        };
        const user = await userService.updateUser(req.user.id , allowedUpdate);
        return res.status(200).json({
            success: true,
            message:"Updated  myinfo",
            data : user,
            error: {}
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer",error);
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}
const deleteMyAccount = async (req,res) => {
    try {
        const user = await userService.deleteAccount(req.user.id , req.user.refreshToken);
        return res.status(200).json({
            success: true,
            message:"Account Deleted",
        });
    } catch (error) {
        console.log("Something went wrong in user controller layer",error);
        return res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error,
        });
    }
}




module.exports = {
    signUp,
    signIn,
    refreshToken,
    makeAdmin,
    makeManager,
    changePassword,
    logout,
    logoutAll,
    dummy,
    getAllUsers,
    getUser,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount
}