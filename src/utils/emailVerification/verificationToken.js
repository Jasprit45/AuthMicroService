const crypto = require('crypto');

const generateVerificationToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    
    const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');
    return {
        rawToken,     
        hashedToken   
    };
};

module.exports = {
    generateVerificationToken
};