const {OAuth2Client} = require('google-auth-library');
const UserRepository = require('../repository/userRepository');
const TokenRepository = require('../repository/tokenRepository');
const UserService  = require('./userService');
const {GOOGLE_CLIENT_ID} = require('../config/serverConfig')

const userService = new UserService();
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class GoogleAuthService {

    async googleLogin(idToken) {
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience:GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();

            const {
                email,
                name,
                sub:googleId,
                email_verified
            } = payload;

            if(!email_verified) throw new Error("Google email not verified");

            let user  = await userRepository.getByEmail(email);  //let for reassigning 

            if(!user) {   //create new user
                user = await userRepository.createOAuthUser({email,name,googleId,provider: 'GOOGLE'});
            }

            user.googleId = googleId;
            user.provider = 'GOOGLE';

            // console.log(user.id);

            const accessToken = userService.createAccessToken(user);
            const refreshToken = userService.createRefreshToken(user);

            const hashedToken = userService.hashToken(refreshToken);

            await tokenRepository.create({
                userId : user.id,
                token : hashedToken,
                expiresAt : new Date(Date.now() + 15*24*60*60*1000)
            });

            return {
                user,
                accessToken,
                refreshToken
            }

            
        } catch (error) {
            console.log("Something went wrong in google-auth-service layer", error);
            throw error;
        }
    }

}

module.exports = GoogleAuthService;

