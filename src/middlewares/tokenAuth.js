const jwt = require('jsonwebtoken');
const {JWT_ACCESS_KEY , JWT_REFRESH_KEY} = require('../config/serverConfig');
const UserRepository  = require('../repository/userRepository');
const TokenRepository  = require('../repository/tokenRepository');
const UserService = require('../service/userService');

const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const userService = new UserService();

const isAuthenticated = async (req,res,next) => {  
    try {
        const accessToken = req.headers['x-access-token'];
        if(!accessToken) return  res.status(401).json({message: "no access token" });
        
        // console.log("haiii-------");
        const decoded = jwt.verify(accessToken,JWT_ACCESS_KEY);
        const user = await userRepository.getById(decoded.id);
        
        
        if (decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({
                message: "Token expired (version mismatch)"
            });
        }
        req.user = {
            id: user.id,
            role: user.role
        };
       
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
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
    next();
}
const isManager = (req,res,next) => { 
    // console.log(req.body.userrole); 
    if(req.user.role !== 'MANAGER'){
        return res.status(403).json({
            message: "Access denied. Manager only."
        });
    }
    next();
}
const isManagerOrAdmin = (req,res,next) => { 
    // console.log(req.body.userrole); 
    if(req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN'){
        return res.status(403).json({
            message: "Access denied. Admin and Manager only."
        });
    }
    next();
}
const isManagerOrAdminOrSelf = (req,res,next) => { 
    
    // console.log("sdbciasfbvvh-------------", req.user); 
    if(req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN' && req.user.id != req.params.id){
        return res.status(403).json({
            message: "Access denied. Owner and Admin/Manager only."
        });
    }
    next();
}

const verifyRefreshToken = async (req,res,next) => {  
    try {
        const refreshToken = req.headers['refresh-token'];
        if(!refreshToken) return  res.status(401).json({message: "refresh token required!" });

        const response = jwt.verify(refreshToken,JWT_REFRESH_KEY);

        const user = await userRepository.getById(response.id);
  
        if (response.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({
                message: "Token expired (version mismatch)"
            });
        }
        const session = await tokenRepository.findBySessionId(response.sessionId);
        
        if(!session) {
            return res.status(401).json({
                message: "Session expired"
            });
        }

        const hashedToken = userService.hashToken(refreshToken);
        
        if(session.token !== hashedToken){ 
            return res.status(401).json({
                message: "Token expired (version mismatch)"
            });
        }
        
        req.user =  response;
        req.user.refreshToken = refreshToken;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
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
    verifyRefreshToken,
    isAdmin,
    isManager,
    isManagerOrAdmin,
    isManagerOrAdminOrSelf,
}