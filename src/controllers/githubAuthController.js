const GithubAuthService = require('../service/githubAuthService');

const githubAuthService = new GithubAuthService();

async function redirectToGithub(req, res) {
    console.log("haiii---")
    const url = githubAuthService.getGithubAuthURL();
    return res.redirect(url);
}

const githubLogin = async(req,res) => {
    try {
        const {code} = req.query;

        const response = await githubAuthService.handleGithubCallback(code);
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
    redirectToGithub,
    githubLogin,
}