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
            data.role = 'USER';  //can't logic with admin and manager
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

    createAccessToken(user) {
        try {
            if(!user.role) user.role = 'USER';
            // console.log("ROLE ---- ",user.role);
            const token = jwt.sign({id:user.id, role:user.role},JWT_ACCESS_KEY,{expiresIn: '1d'});
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

    async verifyRefreshToken(token){
        try {
            const decoded = jwt.verify(token,JWT_REFRESH_KEY);
            return decoded;
        } catch (error) {
             if (error.name === "TokenExpiredError") {
                return { expired: true };
            }

            if (error.name === "JsonWebTokenError") {
                return { invalid: true };
            }
            throw error;
        }
    }

    async assignNewAccessToken(refreshToken,userId){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object
            if(!user) return new Error("This account has been deleted");

            //match refresh token

            const hashedRefreshToken = this.hashToken(refreshToken);

            //search in db if it is abilable or not ?

            // console.log("hashedRefreshToken :" ,hashedRefreshToken );

            const res = await this.tokenRepository.getByToken(hashedRefreshToken);

            // console.log(res.dataValues);

            if(!res) return new Error("Sign in required!");

            const newAccessToken = this.createAccessToken(user.dataValues);

            // console.log(newAccessToken);

            return {
                accessToken:newAccessToken,
                refreshToken:refreshToken,
            };
        } catch (error) {
             if (error.name === "TokenExpiredError") {
                return { expired: true };
            }

            if (error.name === "JsonWebTokenError") {
                return { invalid: true };
            }
            throw error;
        }
    }

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

            if(!user.role){
                user.role = 'USER'; // for temp period
                await user.save();
            } 

            //TODO : use rate-limiter and limit one user can only login from 3 diffrent device/tabs.

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

            //get the user
            // console.log(userId);
            const user  = await this.userRepository.getById(userId); //sequelize object

            //compare old-password
            const isMatch = this.comparePassword(oldPassword,user.dataValues.password);
            if(!isMatch) throw {error: "OLD PASSWORD NOT MATCHED"};
            
            //encrypting password before update 
            user.password = bcrypt.hashSync(newPassword,SALT);

            await user.save();  //save in userdb
            return {
                id:user.id,
                name:user.name,
                email:user.email,
            }; 

        } catch (error) {
            console.log("Something went wrong in userService");
            throw error;
        }
    }

    async makeAdmin(userId ,guestEmail){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            if(!user) throw {error: "Not a valid user"};

            const guestUser = await this.userRepository.getByEmail(guestEmail); //return json object
            
            const res = await this.userRepository.updateRoleToAdmin(guestUser.id);
            
            //the guestUser should logged out to change the role 
            //logging out all the session of that user
            await this.tokenRepository.deleteById(guestUser.id);
            
            return res;
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async makeManager(userId ,guestEmail){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            if(!user) throw {error: "Not a valid user"};
            
            const guestUser = await this.userRepository.getByEmail(guestEmail); //return json object
            const res = await this.userRepository.updateRoleToManager(guestUser.id);

            await this.tokenRepository.deleteById(guestUser.id);
            return true;
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
   
    async logout(refreshToken){
        try {
            //check the refresh token
            await this.verifyRefreshToken(refreshToken); //await to hold and check the token

            const hashedToken = this.hashToken(refreshToken);

            //then delete the token from db
            const res = await this.tokenRepository.deleteByToken(hashedToken);
             
            return res;

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async logoutAll(id){
        try {
           
            //then delete the userid from db
            const res = await this.tokenRepository.deleteById(id);
            return res;

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async getAllUsers(query){
        try {
            const {count , rows} = await this.userRepository.getAllUsers(query);

             return {
                totalUsers: count,
                totalPages: Math.ceil(count / query.limit),
                currentPage: Number(query.page) || 1,
                users: rows
            };

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async getUser(id){
        try {
            const user = await this.userRepository.getById(id);
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                googleId:user.googleId,
                githubId:user.githubId,
                provider:user.provider
            };
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async getMyProfile(id){
        try {
            const user = await this.userRepository.getById(id);
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            };
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async updateUser(id, update){
        try {
            const user = await this.userRepository.updateUserById(id,update);
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            };
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
}

module.exports = UserService;