const sender = require('../config/emailConfig');
const {EMAIL_FROM} = require('../config/serverConfig')
const { verificationEmailTemplate } = require('../utils/emailVerification/emailTemplate');

sender.verify((error, success) => {
    if (error) {
        console.error("Email server error:", error.message);
    } else {
        console.log("Email server is ready");
    }
});

const sendVerificationEmail = async (email, verificationLink) => {
    return sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: verificationEmailTemplate(verificationLink)
    });
};

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await sender.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html
        });

        console.log("Email sent:", info.messageId);
        return info;

    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
};

module.exports = {
    sendEmail,
    sendVerificationEmail
}