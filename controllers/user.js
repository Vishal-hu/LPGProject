const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/order");
require("../models/admin");
require("../models/verification");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");
const AdminModel = mongoose.model("admin");
const VerificationModel = mongoose.model("verification");
const mailUtilCtrl = require("../utils/mailutil");
var moment = require('moment');

router.post('/create-admin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    await AdminModel.insertMany({
        username,
        password
    })
    res.send({ success: true, msg: 'admin created' })
})
const appName = 'LpgApp';
const version = '1.0';

router.post('/user', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {

            if (req.body.servicename == 'addCustomer') {
                let currentTimeStamp = new Date().getTime();
                const id = currentTimeStamp;
                const name = req.body.data[0].name;
                const address = req.body.data[0].address;
                const mobile = req.body.data[0].mobile;
                const emailID = req.body.data[0].email;
                const aadhar = req.body.data[0].aadhar;
                const gstNumber = req.body.data[0].gstNumber;
                const companyName = req.body.data[0].companyName;
                let isExist = await UserModel.findById(id);
                if (isExist) {
                    res.send({ success: false, msg: "User already exists" });
                } else {
                    const createdUser = await UserModel.insertMany({
                        _id: id,
                        name,
                        address,
                        mobile,
                        emailID,
                        aadhar,
                        gstNumber,
                        companyName,
                    })
                    res.send({ success: true, msg: 'User created', user: createdUser })
                }
            } else if (req.body.servicename == 'getCustomer') {
                let users = await UserModel.find({}).populate("orders");
                res.send({ success: true, customers: users });
            } else if (req.body.servicename == 'getCustomerById') {
                const id = req.body.customerId;
                let user = await UserModel.findById({ _id: id }).populate("orders");
                res.send(user);
            } else if (req.body.servicename == 'updateCustomer') {
                const id = req.body.data[0].id;
                const name = req.body.data[0].name;
                const address = req.body.data[0].address;
                const mobile = req.body.data[0].mobile;
                const emailID = req.body.data[0].email;
                const aadhar = req.body.data[0].aadhar;
                const gstNumber = req.body.data[0].gstNumber;
                const companyName = req.body.data[0].companyName;

                const random_number = Math.floor(100000 + Math.random() * 900000);
                const userFound = await UserModel.findOne({ _id: id })
                if (userFound) {
                    await VerificationModel.insertMany({
                        userId: id,
                        mobile: mobile,
                        email: emailID,
                        random_number: random_number
                    })
                    const updatedCustomer = await UserModel.updateOne({ _id: id }, {
                        $set: {
                            name,
                            address,
                            mobile,
                            emailID,
                            aadhar,
                            gstNumber,
                            companyName
                        }
                    })
                    const mailMessage = await mailUtilCtrl.mailSend(emailID, random_number, false)
                    res.send({ success: true, msg: "customer updated, OTP sent on user's new mail address" })
                } else {
                    res.send({ success: false, msg: 'User not found with this mobile number. Please! Register first with this number' })
                }
            }
            // else if (req.body.servicename == 'verifiedCustomerUpdate') {
            //     const {
            //         otp,
            //         name,
            //         previousEmail,
            //         currentEmail,
            //         address,
            //         isMobileUpdate,
            //         isEmailUpdate,
            //         currentMobile,
            //         previousMobile,
            //         aadhar,
            //         gstNumber,
            //         companyName
            //     } = req.body.data[0];

            //     const userFound = await UserModel.findOne({ $or: [{ mobile: previousMobile }, { emailID: previousEmail }] })
            //     if (userFound) {
            //         const otpFound = await VerificationModel.findOne({
            //             $and: [
            //                 { mobile: previousMobile },
            //                 { random_number: otp },
            //                 { email: previousEmail }
            //             ],
            //         })
            //         if (otpFound) {
            //             let currentTime = moment(new Date());
            //             let documentTime = otpFound.created_at;
            //             let duration = moment.duration(currentTime.diff(documentTime));
            //             var minutes = duration.asMinutes();
            //             if (minutes > 10) {
            //                 res.send({ success: false, msg: 'OTP expired' })
            //             } else {
            //                 if (isMobileUpdate) {
            //                     let userUpdated = await UserModel.updateOne(
            //                         {
            //                             emailID: previousEmail,
            //                         },
            //                         {
            //                             $set: {
            //                                 name: name,
            //                                 address: address,
            //                                 mobile: currentMobile,
            //                                 aadhar: aadhar,
            //                                 gstNumber: gstNumber,
            //                                 companyName: companyName
            //                             },
            //                         }
            //                     );
            //                     res.send({ success: true, updatedUser: userUpdated })
            //                 } else if (isEmailUpdate) {
            //                     let userUpdated = await UserModel.updateOne(
            //                         {
            //                             mobile: previousMobile,
            //                         },
            //                         {
            //                             $set: {
            //                                 emailID: currentEmail,
            //                                 name: name,
            //                                 address: address,
            //                                 aadhar: aadhar,
            //                                 gstNumber: gstNumber,
            //                                 companyName: companyName
            //                             },
            //                         }
            //                     );
            //                     res.send({ success: true, updatedUser: userUpdated })
            //                 }
            //             }
            //         } else {
            //             res.send({ success: false, msg: 'otp not matched' })
            //         }
            //     } else {
            //         res.send({ success: false, msg: 'user not found' })
            //     }
            // }
            else if (req.body.servicename == 'deleteCustomerById') {
                const id = req.body.id;
                const userFound = await UserModel.findOne({ _id: id })
                if (userFound) {
                    await UserModel.deleteOne({ _id: id })
                    await OrderModel.deleteMany({ user_id: id })
                    res.send({ success: true, msg: 'User and his/her order deleted' })
                } else {
                    res.send({ success: false, msg: 'user not found with this id' })
                }

            } else if (req.body.servicename == 'deleteAllCustomers') {
                await UserModel.deleteMany({})
                await OrderModel.deleteMany({})
                res.send({ success: true, msg: 'All users and their related orders deleted' })
            }
            else {
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
