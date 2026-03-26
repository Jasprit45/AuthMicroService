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

// const isAdmin = async (req,res) => {
//     try {
//         const response = await userService.isAdmin(req.body.userId);
//         if(!response) {
//             return res.status(200).json({
//             success: true,
//             message:"user is NOT an admin",
//             data: response,
//             error: {}
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             message:"user is admin",
//             data: response,
//             error: {}
//         });
//     } catch (error) {
//         console.log("Something went wrong in user controller layer");
//         return res.status(500).json({
//             success: false,
//             message:"Something went wrong",
//             data: {},
//             error: error,
//         });
//     }
// }

// const makeAdmin = async (req,res) => {
//     try {
//         const response = await userService.makeAdmin(req.body.userId);
//         return res.status(200).json({
//             success: true,
//             message:"user is now an admin",
//             data: response,
//             error: {}
//         });
//     } catch (error) {
//         console.log("Something went wrong in user controller layer");
//         return res.status(500).json({
//             success: false,
//             message:"Something went wrong",
//             data: {},
//             error: error,
//         });
//     }
// }
// const isManager = async (req,res) => {
//     try {
//         const response = await userService.isManager(req.body.userId);
//         if(!response) {
//             return res.status(200).json({
//             success: true,
//             message:"user is NOT a Manager",
//             data: response,
//             error: {}
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             message:"user is a Manager",
//             data: response,
//             error: {}
//         });
//     } catch (error) {
//         console.log("Something went wrong in user controller layer");
//         return res.status(500).json({
//             success: false,
//             message:"Something went wrong",
//             data: {},
//             error: error,
//         });
//     }
// }

// const makeManager = async (req,res) => {
//     try {
//         const response = await userService.makeManager(req.body.userId);
//         return res.status(200).json({
//             success: true,
//             message:"user is now a manager",
//             data: response,
//             error: {}
//         });
//     } catch (error) {
//         console.log("Something went wrong in user controller layer");
//         return res.status(500).json({
//             success: false,
//             message:"Something went wrong",
//             data: {},
//             error: error,
//         });
//     }
// }
const changePassword = async (req,res) => {
    try {
        const response = await userService.updatePassword( req.body.userId , req.body.oldPassword, req.body.newPassword);
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


module.exports = {
    signUp,
    signIn,
    
    // isAdmin,
    // makeAdmin,
    // isManager,
    // makeManager,
    changePassword,
    logout
}