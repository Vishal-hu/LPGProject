require('dotenv').config()
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASSWORD,
    },
});

const mailSend = async (toMailAddress, otp) => {

    let mailOptions = {
        from: process.env.MAILUSER,
        to: toMailAddress,
        subject: `OTP from PremiumLPG`,
        html: `Please use otp ${otp} for login process`,
        // attachments: [
        //   {
        //     filename: `${name}.pdf`,
        //     path: path.join(__dirname, `../../src/assets/books/${name}.pdf`),
        //     contentType: 'application/pdf',
        //   },
        // ],
    };

    return transporter.sendMail(mailOptions)
        // , function (err, info) {
        // if (err) {
        //     console.log(err);;
        // }
        // else {
        //     return info
        // }
    // });

}
module.exports = {
    mailSend: mailSend
}