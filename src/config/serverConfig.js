const dotenv = require("dotenv");
const bcrypt = require('bcrypt');

dotenv.config();

module.exports = {
    PORT:process.env.PORT,
    SALT: bcrypt.genSaltSync(10),
    JWT_ACCESS_KEY:process.env.JWT_ACCESS_KEY,
    JWT_REFRESH_KEY:process.env.JWT_REFRESH_KEY,
    TOKEN_SECRET:process.env.TOKEN_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
    REFRESH_KEY_EXPIRY:process.env.REFRESH_KEY_EXPIRY,
    ACCESS_KEY_EXPIRY:process.env.ACCESS_KEY_EXPIRY,
    SESSIONS_ALLOWED:process.env.SESSIONS_ALLOWED,
    REQUEST_LIMIT:process.env.REQUEST_LIMIT,
    EMAIL_PASS:process.env.EMAIL_PASS,
    EMAIL_USER:process.env.EMAIL_USER,
}