const jwt = require('jsonwebtoken');
const {JWT_ACCESS_KEY , JWT_REFRESH_KEY} = require('../config/serverConfig');

const isAuthenticated = (req,res,next) => {  
    try {
        const accessToken = req.headers['x-access-token'];
        // console.log(accessToken);
        if(!accessToken) return  res.status(401).json({message: "no access token" });

        const response = jwt.verify(accessToken,JWT_ACCESS_KEY);
        // console.log("Response : ", response);
        // console.log("Response id : ", response.id);
        // console.log("Response role : ", response.role);
        req.user = response;
        
        next();
    } catch (error) {
        if(error?.expired) {
            return res.status(401).json({
                message: "Token is expired"
            });
        } 
        console.log(error); 
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
const isAdmin = (req,res,next) => { 
    // console.log(req.body.userrole); 
    if(req.user.role !== 'ADMIN'){
        res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
    next();
}
const isManager = (req,res,next) => { 
    // console.log(req.body.userrole); 
    if(req.user.role !== 'MANAGER'){
        res.status(403).json({
            message: "Access denied. Manager only."
        });
    }
    next();
}
const isManagerOrAdmin = (req,res,next) => { 
    // console.log(req.body.userrole); 
    if(req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN'){
        res.status(403).json({
            message: "Access denied. Admin and Manager only."
        });
    }
    next();
}

const isRefreshToken = (req,res,next) => {  
    try {
        const refreshToken = req.headers['refresh-token'];
        if(!refreshToken) return  res.status(401).json({message: "refresh token required!" });

        const response = jwt.verify(refreshToken,JWT_REFRESH_KEY);
        req.user =  response;
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
    isAdmin,
    isManager,
    isManagerOrAdmin,
}