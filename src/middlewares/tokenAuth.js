const jwt = require('jsonwebtoken');
const {JWT_ACCESS_KEY , JWT_REFRESH_KEY} = require('../config/serverConfig');

const isAuthenticated = (req,res,next) => {  
    try {
        const accessToken = req.headers['x-access-token'];
        if(!accessToken) return  res.status(401).json({message: "no access token" });

        const response = jwt.verify(accessToken,JWT_ACCESS_KEY);
        req.body.userId =  response.id;
        // console.log("Working",response.id);

        next();
    } catch (error) {
        if(error?.expired) {
            return res.status(401).json({
                message: "Token is expired"
            });
        }  
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
const isRefreshToken = (req,res,next) => {  
    try {
        const refreshToken = req.headers['refresh-token'];
        if(!refreshToken) return  res.status(401).json({message: "refresh token required!" });

        const response = jwt.verify(refreshToken,JWT_REFRESH_KEY);
        req.body.userId =  response.id;
        req.body.refreshToken = refreshToken;
        next();
    } catch (error) {
        if(error?.expired) {
            return res.status(401).json({
                message: "Token is expired"
            });
        }  
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}


module.exports = {
    isAuthenticated,
    isRefreshToken,
}