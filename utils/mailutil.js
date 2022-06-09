require('dotenv').config()
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,//true
    port: 25,//465
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
});

const mailSend = async (toMailAddress, otp, attachments) => {
    let mailOptions = {};
    if (attachments) {
        mailOptions = {
            from: process.env.MAILUSER,
            to: toMailAddress,
            subject: `OTP from PremiumLPG`,
            html: `Order details from premium LPG`,
            attachments: [
                {
                    filename: `${name}.pdf`,
                    path: path.join(__dirname, `../../src/assets/books/${name}.pdf`),
                    contentType: 'application/pdf',
                },
            ],
        };
    } else {
        mailOptions = {
            from: process.env.MAILUSER,
            to: toMailAddress,
            subject: `OTP from PremiumLPG`,
            html: `Please use otp ${otp} for login process`,
        };
    }

    return transporter.sendMail(mailOptions)

}
module.exports = {
    mailSend: mailSend
}