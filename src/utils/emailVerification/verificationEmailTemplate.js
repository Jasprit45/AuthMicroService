const verificationEmailTemplate = (verificationLink) => {
    return `
        <h2>Verify Your Email</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}" 
           style="padding:10px 20px; background:blue; color:white; text-decoration:none;">
           Verify Email
        </a>
        <p>This link will expire in 10 minutes.</p>
    `;
};

module.exports = {
    verificationEmailTemplate
};