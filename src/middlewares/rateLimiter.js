const rateLimit = require('express-rate-limit');
const {REQUEST_LIMIT , }  = require('../config/serverConfig')

const sessionRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: REQUEST_LIMIT, // requests per session per minute

    keyGenerator: (req) => {
        return req.user.sessionId; 
    },

    message: {
        success: false,
        error: "Too many requests from this session. Please try again later."
    }
});


module.exports = {
    sessionRateLimiter,
}