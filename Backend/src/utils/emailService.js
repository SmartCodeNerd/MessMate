import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or another service
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });

    // 2. Define email options
    const mailOptions = {
        from: 'MessMate <no-reply@yourapp.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;