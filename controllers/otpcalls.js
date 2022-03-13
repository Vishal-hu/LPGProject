const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/verification");
const UserModel = mongoose.model("user")
const VerificationModel = mongoose.model("verification");

const appName = 'LpgApp';
const version = '1.0';
router.post('/otp', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {
            if (req.body.servicename == 'sendOTP') {
                const mobile = req.body.data[0].mobile;
                const random_number = Math.floor(100000 + Math.random() * 900000);
                const userFound = await UserModel.findOne({ mobile: mobile })
                if (userFound) {
                    await VerificationModel.insertMany({
                        userId: userFound._id,
                        mobile: userFound.mobile,
                        random_number: random_number
                    })
                    res.send({ success: true, MobileOTP: random_number })
                } else {
                    res.send({ success: false, msg: 'User not found with this mobile number. Please! Register first with this number' })
                }
            } else if (req.body.servicename == 'verifyOTP') {
                const mobile = req.body.data[0].mobile;
                const otp = req.body.data[0].mobileOTP;

                const otpFound = await VerificationModel.findOne({
                    $and: [
                        { mobile: mobile },
                        { random_number: otp }
                    ],
                })
                if (otpFound) {
                    res.send({ success: true, msg: "OTP matched" })
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