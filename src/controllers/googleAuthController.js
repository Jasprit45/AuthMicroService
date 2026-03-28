const GoogleAuthService = require('../service/googleAuthService');

const googleAuthService = new GoogleAuthService();

const googleLogin = async(req,res) => {
    try {
        // console.log("body : ",req.body);
        const {idToken} = req.body;

        if(!idToken) {
            return res.status(400).json({
                success:false,
                message: "idtoken is required!!"
            });
        }

        const response = await googleAuthService.googleLogin(idToken);
        return res.status(200).json({
            success: true,
            message:"token created",
            data: response,
            error: {}
        });
    
    } catch (error) {
        console.log("Something went wrong in googleAuth controller layer");
        return res.status(500).json({
            success: false,
            message:"User not signed in",
            error: error
        });
    }
}

module.exports = {
    googleLogin,
}