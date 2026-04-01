const nodemailer = require("nodemailer");
const {EMAIL_USER,EMAIL_PASS} = require('./serverConfig');

const sender = nodemailer.createTransport({
    service: 'gmial',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});



module.exports = sender;