// utils/emailService.js
const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or another service
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: 'Mess Coupon System <no-reply@yourapp.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};