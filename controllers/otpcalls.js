const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/verification");
const UserModel = mongoose.model("user")
const VerificationModel = mongoose.model("verification");

router.post('/send-otp', async (req, res) => {
    const mobile = req.body.mobile;
    const random_number = Math.floor(100000 + Math.random() * 900000);
    const userFound = await UserModel.findOne({ mobile: mobile })
    if (userFound) {
        await VerificationModel.insertMany({
            userId: userFound._id,
            mobile: userFound.mobile,
            random_number: random_number
        })
        res.send({ MobileOTP: random_number })
    } else {
        res.send({ msg: 'User not found with this mobile number. Please register first with this number' })
    }
})

router.post('/verify-otp', async (req, res) => {
    const mobile = req.body.mobile;
    const otp = req.body.mobileOTP;

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
})

module.exports = router;