const nodemailer = require("nodemailer");
const {EMAIL_USER,EMAIL_PASS} = require('./serverConfig');

const sender = nodemailer.createTransport({
    service: 'Gmial',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});



module.exports = sender;