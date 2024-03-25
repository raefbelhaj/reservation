// nodemailerConfig.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'raefbelhaj54@gmail.com',
        pass: 'iwda zsna pipy rajf'
    }
});

module.exports = transporter;
