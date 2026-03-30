const axios = require('axios');
const UserRepository = require('../repository/userRepository');
const TokenRepository = require('../repository/tokenRepository');
const UserService  = require('./userService');
const {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} = require('../config/serverConfig')

const userService = new UserService();
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();


class GithubAuthService {

    getGithubAuthURL() {
        return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
    }

    async handleGithubCallback(code) {
        try {
            const tokenRes = await axios.post(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code
                },
                {
                    headers: { Accept: 'application/json' }
                }
            );

            const accessToken = tokenRes.data.access_token;


            const userRes = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const emailRes = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const primaryEmail = emailRes.data.find(e => e.primary).email;

            const { id: githubId, name } = userRes.data;

            // 3. DB logic
            let user = await userRepository.getByEmail(primaryEmail);

            if (!user) {
                user = await userRepository.createOAuthUser({
                    email: primaryEmail,
                    name,
                    googleId: null,
                    provider: 'GITHUB',
                    password: null
                });
            }

            // 4. Tokens
            const jwtAccess = userService.createAccessToken(user);
            const jwtRefresh = await userService.createRefreshToken(user);

            return {
                user,
                accessToken: jwtAccess,
                refreshToken: jwtRefresh
            };

        } catch (error) {
            console.log("GitHub Auth Error:", error);
            throw error;
        }
    }

}

module.exports = GithubAuthService;

