const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/order");
require("../models/admin");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");
const AdminModel = mongoose.model("admin")

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
                const name = req.body.data[0].name;
                const oldEmailID = req.body.data[0].oldEmail;
                const newEmailID = req.body.data[0].newEmail;
                const address = req.body.data[0].address;
                const newMobile = req.body.data[0].newMobile;
                const aadhar = req.body.data[0].aadhar;
                const gstNumber = req.body.data[0].gstNumber;
                const companyName = req.body.data[0].companyName;
                const isExist = await UserModel.findOne({ emailID : oldEmailID });

                if (isExist) {
                    let userUpdated = await UserModel.updateOne(
                        {
                            emailID : oldEmailID,
                        },
                        {
                            $set: {
                                emailID: newEmailID,
                                name: name,
                                address: address,
                                mobile: newMobile,
                                aadhar: aadhar,
                                gstNumber: gstNumber,
                                companyName: companyName
                            },
                        }
                    );
                    res.send({ success: true, msg: 'user successfully updated' });
                } else {
                    res.send({ success: false, msg: "User does not exist" });
                }
            } else if (req.body.servicename == 'deleteCustomerById') {
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
