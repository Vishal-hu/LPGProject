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
                const id = 'CLP-' + req.body.data[0].mobile;
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
                const id = 'CLP-' + req.body.data[0].mobile;
                const name = req.body.data[0].name;
                const address = req.body.data[0].address;
                const mobile = req.body.data[0].mobile;
                const aadhar = req.body.data[0].aadhar;
                const gstNumber = req.body.data[0].gstNumber;
                const companyName = req.body.data[0].companyName;
                const isExist = await UserModel.findById({ _id: id });

                if (isExist) {
                    let userUpdated = await UserModel.updateOne(
                        {
                            _id: id,
                        },
                        {
                            $set: {
                                name: name,
                                address: address,
                                mobile: mobile,
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
