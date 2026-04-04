const UserRepository  = require('../repository/userRepository');
const TokenRepository = require('../repository/tokenRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {JWT_ACCESS_KEY,SALT,JWT_REFRESH_KEY,TOKEN_SECRET,ACCESS_KEY_EXPIRY,REFRESH_KEY_EXPIRY,SESSIONS_ALLOWED,CLIENT_URL} = require('../config/serverConfig');
const { v4: uuidv4 } = require('uuid');
const {generateVerificationToken , hashVerificationToken} = require('../utils/emailVerification/verificationToken');
const EmailTokenRepository  = require('../repository/emailTokenRepository');
const {sendVerificationEmail ,sendEmail}  = require('./emailService');
const PasswordResetToken = require('../repository/passwordResetToken');
const {passwordResetTemplate} = require('../utils/emailVerification/emailTemplate')


class UserService {

    constructor() {
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
        this.emailTokenRepository = new EmailTokenRepository();
        this.passwordResetToken = new PasswordResetToken();
    }

    async signUp(data) {
        try {
            const user = await this.userRepository.create({...data,role: 'USER',isVerified:false});

            const { rawToken, hashedToken } = generateVerificationToken();

            await this.emailTokenRepository.create({
                userId: user.id,
                token: hashedToken,
            });

            const verificationLink = `${CLIENT_URL}/api/v1/auth/verify-email?token=${rawToken}`;

            await sendVerificationEmail( data.email, verificationLink);

            return user;
        } catch (error) {
            console.log("Something went wrong in user service layer",error);
            throw error;
        }
    }
    async reVerification(email) {
        try {
            
            const user = await this.userRepository.getByEmail(email);
            if(!user) return new Error("User not found");
            if(user.isVerified) return {message: "User Already Verified"};

            await this.emailTokenRepository.delete(user.id);

            const { rawToken, hashedToken } = generateVerificationToken();

            await this.emailTokenRepository.create({
                userId: user.id,
                token: hashedToken,
            });

            const verificationLink = `${CLIENT_URL}/api/v1/auth/verify-email?token=${rawToken}`;

            await sendVerificationEmail( email, verificationLink);

            return {message: "Email verified succesfully"};
        } catch (error) {
            console.log("Something went wrong in user service layer",error);
            throw error;
        }
    }
    async verifyEmail(rawToken) {
        try {
            const hashedToken = hashVerificationToken(rawToken);

            const userToken = await this.emailTokenRepository.getByToken(hashedToken);
            if(!userToken) throw new Error("User not found");
            if(userToken.expiresAt < new Date()) throw new Error("Token Expired");

            const user = await this.userRepository.getById(userToken.userId);
            if (!user) throw new Error("User not found");
        
            user.isVerified = true;
            await user.save();

            await this.emailTokenRepository.delete(userToken.id);
            
            return {message: "Email verified succesfully"};

        } catch (error) {
            console.log("Something went wrong in user service layer",error);
            throw error;
        }
    }
    async resetPassword({rawToken,newPassword}) {
        try {
            const hashedToken = hashVerificationToken(rawToken);

            const userToken = await this.passwordResetToken.get(hashedToken);
            if(!userToken) throw new Error("User not found");
            if(userToken.expiresAt < new Date()) throw new Error("Token Expired");

            const user = await this.userRepository.getById(userToken.userId);
            if (!user) throw new Error("User not found");
        
            user.password = newPassword;
            await user.save();

            await this.passwordResetToken.delete(userToken.id);
            
            return {message: "Password Reset succesfully"};

        } catch (error) {
            console.log("Something went wrong in user service layer",error);
            throw error;
        }
    }

    async forgetPassword({email}){
        try {
            const user = await this.userRepository.getByEmail(email);
            if(!user) return new Error("User not found");

            await this.passwordResetToken.deleteByUserId(user.id);
            const { rawToken, hashedToken } = generateVerificationToken();

            await this.passwordResetToken.create({
                userId: user.id,
                token: hashedToken,
            });

            const verificationLink = `${CLIENT_URL}/api/v1/auth/reset-password?token=${rawToken}`;

            await sendEmail({
                to: email,
                subject: "Reset-Password",
                html: passwordResetTemplate(verificationLink)
            });

            return {message: "Email verified succesfully"};
            
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }

    

    createAccessToken(user , refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken , JWT_REFRESH_KEY);
            const token = jwt.sign({id:user.id, sessionId:decoded.sessionId , role:user.role},JWT_ACCESS_KEY,{expiresIn: ACCESS_KEY_EXPIRY});
            return token;
        } catch (error) {
            throw error;
        }
    }
    async createRefreshToken(user) {  //create a refresh token and save it by hashing
        try {
            const sessionId = uuidv4();
           
            const token = jwt.sign({id:user.id, tokenVersion:user.tokenVersion, sessionId:sessionId},JWT_REFRESH_KEY,{expiresIn: REFRESH_KEY_EXPIRY});
            const hashedToken = this.hashToken(token);
            await this.tokenRepository.create({
                userId : user.id,
                token : hashedToken,
                sessionId:sessionId
            });
            return token;
        } catch (error) {
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
            const res = await this.tokenRepository.getByToken(hashedRefreshToken);

            // console.log(res.dataValues);
            if(!res) return new Error("Sign in required!");

            // console.log(res.sessionId);
            // console.log(user);

            const newAccessToken = this.createAccessToken(user , refreshToken);

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
            const user = await this.userRepository.getByEmail(email);  
            if(!user) throw {error: "User not found"};
            if(user.googleId || user.githubId) {  //for temp user that are already logged in
                user.isVerified = true;
                await user.save();
            }
            if(!user.isVerified) throw {error: "User is not verified (verify your email)"};

            const isMatch = this.comparePassword(plainPassword,user.password);
            if(!isMatch) throw {error:"Password Not Matched"};

            const noOfSessions = await this.tokenRepository.countSessions(user.id);

            console.log("--------- : ", noOfSessions);

            if(noOfSessions>=SESSIONS_ALLOWED) {
                await this.tokenRepository.deleteOldestSession(user.id);
                //TODO : Delete specific session chossen by user (like hotstar)
            }

            const refreshToken = await this.createRefreshToken(user);
            const accessToken = this.createAccessToken(user , refreshToken);
            //TODO : use rate-limiter and limit one user can only login for 3 diffrent sessions.

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

            //logging out all session while password change for security
            user.tokenVersion +=1;
            await this.tokenRepository.deleteById(userId); //also delete it from user frontend
            
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
            guestUser.tokenVersion+=1;
            await guestUser.save();
            
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
            guestUser.tokenVersion+=1;
            await guestUser.save();

            await this.tokenRepository.deleteById(guestUser.id);
            return true;
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
   
    async logout(refreshToken){
        try {
            // refresh token is already verified in middleware
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
            const user = await this.userRepository.getById(id);
            user.tokenVersion+=1;
            await user.save();
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
    async deleteAccount(id,refreshToken){
        try {
            // refresh token is already verified in middleware
            const hashedToken = this.hashToken(refreshToken);

            //then delete the token from db
            const res = await this.tokenRepository.deleteByToken(hashedToken);

            // TODO: soft delete (isdeleted = true)

            await this.userRepository.deleteById(id);
            return true;
        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    

    
}

module.exports = UserService;