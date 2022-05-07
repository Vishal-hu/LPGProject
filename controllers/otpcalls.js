const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/verification");
const UserModel = mongoose.model("user")
const VerificationModel = mongoose.model("verification");
const mailUtilCtrl = require("../utils/mailutil");
var moment = require('moment');
const appName = 'LpgApp';
const version = '1.0';
router.post('/otp', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {
            if (req.body.servicename == 'sendOTP') {
                const mobile = req.body.data[0].mobile;
                const email = req.body.data[0].email;
                const random_number = Math.floor(100000 + Math.random() * 900000);
                const userFound = await UserModel.findOne({ $or: [{ mobile: mobile }, { emailID: email }] })
                if (userFound) {
                    await VerificationModel.insertMany({
                        userId: userFound._id,
                        mobile: userFound.mobile,
                        email: userFound.emailID,
                        random_number: random_number
                    })
                    const mailMessage = await mailUtilCtrl.mailSend(userFound.emailID, random_number)
                    res.send({ success: true, msg: "OTP sent on user mail address" })
                } else {
                    res.send({ success: false, msg: 'User not found with this mobile number. Please! Register first with this number' })
                }
            } else if (req.body.servicename == 'verifyOTP') {
                const mobile = req.body.data[0].mobile;
                const otp = req.body.data[0].mobileOTP;
                const email = req.body.data[0].email;
                const userFound = await UserModel.findOne({ $or: [{ mobile: mobile }, { emailID: email }] })
                const otpFound = await VerificationModel.findOne({
                    $and: [
                        { mobile: mobile },
                        { random_number: otp },
                        { email: email }
                    ],
                })
                if (otpFound) {
                    let currentTime = moment(new Date());
                    let documentTime = otpFound.created_at;
                    let duration = moment.duration(currentTime.diff(documentTime));
                    var minutes = duration.asMinutes();
                    if (minutes > 10) {
                        res.send({ success: false, msg: 'OTP expired' })
                    } else {
                        res.send({ success: true, msg: "OTP matched", userData: userFound })
                    }
                } else {
                    res.send({ success: false, msg: "OTP not matched" })
                }
            } else {
                res.send({ success: false, msg: 'Please! provide a valid servicename' })
            }
        } else {
            res.send({ success: false, msg: 'Invalid AppName or Version' })
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;