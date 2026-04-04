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

const passwordResetTemplate = (resetLink) => {
    return `
        <h2>Reset Your Password</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
    `;
};

module.exports = {
    verificationEmailTemplate,
    passwordResetTemplate
};