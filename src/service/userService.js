const UserRepository  = require('../repository/userRepository');
const TokenRepository = require('../repository/tokenRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {JWT_ACCESS_KEY,SALT,JWT_REFRESH_KEY,TOKEN_SECRET} = require('../config/serverConfig');


class UserService {
    
    constructor() {
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
    }

    async signUp(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

    createAccessToken(user) {
        try {
            const token = jwt.sign({id:user.id},JWT_ACCESS_KEY,{expiresIn: '15m'});
            return token;
        } catch (error) {
            throw error;
        }
    }
    createRefreshToken(user) {
        try {
            const token = jwt.sign({id:user.id},JWT_REFRESH_KEY,{expiresIn: '15d'});
            return token;
        } catch (error) {
            throw error;
        }
    }

    // verifyToken(accessToken){
    //     try {
    //         const decoded = jwt.verify(accessToken,JWT_ACCESS_KEY);
    //         return decoded;
    //     } catch (error) {
    //          if (error.name === "TokenExpiredError") {
    //             return { expired: true };
    //         }

    //         if (error.name === "JsonWebTokenError") {
    //             return { invalid: true };
    //         }
    //         throw error;
    //     }
    // }

    comparePassword(plainPassword,encryptedPassword){
        try {
            console.log(plainPassword);
            const isMatch = bcrypt.compareSync(plainPassword,encryptedPassword);
            return isMatch;
        } catch (error) {
            throw error;
        }
    }

    hashToken(token) {
        return crypto.createHash("sha256").update(token + TOKEN_SECRET).digest('hex');
    }

    async signIn(email,plainPassword){
        try {
            const user = await this.userRepository.getByEmail(email);  // get a json object 
            // console.log(user);
            if(!user) throw {error: "User not found"};
            const isMatch = this.comparePassword(plainPassword,user.password);
            // console.log(isMatch);
            
            if(!isMatch) throw {error:"Password Not Matched"};

            const accessToken = this.createAccessToken(user);
            const refreshToken = this.createRefreshToken(user);

            const hashedToken = this.hashToken(refreshToken);


            await this.tokenRepository.create({
                userId : user.id,
                token : hashedToken,
                expiresAt : new Date(Date.now() + 15*24*60*60*1000)
            });

            return {
                accessToken:accessToken,
                refreshToken:refreshToken
            };
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

    

    async updatePassword(userId, oldPassword, newPassword){
        try {
            // is user is authenticated

            //get the user
            // console.log(userId);
            const user  = await this.userRepository.getById(userId); //sequelize object
            

            //compare old-password
            const isMatch = this.comparePassword(oldPassword,user.dataValues.password);
            if(!isMatch) throw {error: "OLD PASSWORD NOT MATCHED"};
            
            //encrypting password before update 
            user.dataValues.password = bcrypt.hashSync(newPassword,SALT);

            await user.save();  //save in userdb
            return user; 

        } catch (error) {
            console.log("Something went wrong in userService");
            throw error;
        }
    }

    //todos
    
    // async isAdmin(userId){
    //     try {
    //         const user = await this.userRepository.getById(userId); //sequelize object 
    //         const adminRole = await this.roleRepository.findAdminRole(); //sequelize object 

    //         const res = await user.hasRole(adminRole);
            
    //         return res;
            
    //     } catch (error) {
    //         console.log("Something went wrong in user service layer");
    //         throw error;
    //     }
    // }
    // async makeAdmin(userId){
    //     try {
    //         const user = await this.userRepository.getById(userId); //sequelize object 
    //         if(!user) throw {error: "Not a valid user"};

    //         const adminRole = await this.roleRepository.findAdminRole(); //sequelize object 
    //         if(!adminRole) throw {error: "Admin is not a Role"};

    //         // console.log(typeof user.addRole);
    //         await user.addRole(adminRole);
    //         return true;

    //     } catch (error) {
    //         console.log("Something went wrong in user service layer", error);
    //         throw error;
    //     }
    // }
    // async isManager(userId){
    //     try {
    //         const user = await this.userRepository.getById(userId); //sequelize object 
    //         const managerRole = await this.roleRepository.findManagerRole(); //sequelize object 

    //         const res = await user.hasRole(managerRole);
            
    //         return res;
            
    //     } catch (error) {
    //         console.log("Something went wrong in user service layer");
    //         throw error;
    //     }
    // }
    // async makeManager(userId){
    //     try {
    //         const user = await this.userRepository.getById(userId); //sequelize object 
    //         if(!user) throw {error: "Not a valid user"};

    //         const managerRole = await this.roleRepository.findManagerRole(); //sequelize object 
    //         if(!managerRole) throw {error: "Admin is not a Role"};

    //         // console.log(typeof user.addRole);
    //         await user.addRole(managerRole);
    //         return true;

    //     } catch (error) {
    //         console.log("Something went wrong in user service layer", error);
    //         throw error;
    //     }
    // }
    async logout(refreshToken){
        try {
            //check the refresh token
            const hashedToken = this.hashToken(refreshToken);

            //then delete the token from db
            const res = await this.tokenRepository.deleteByToken(hashedToken);
             
            return res;

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
}

module.exports = UserService;