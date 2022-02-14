const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
const UserModel = mongoose.model("user");


router.post("/add-user", async function (req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const emailID = req.body.email;
    const aadhar = req.body.aadhar;
    let isExist = await UserModel.findOne({
        email: req.body.email,
    });
    if (isExist) {
        res.sendError("User Already Exist");
        return;
    } else {
        await UserModel.insertMany({
            name,
            address,
            mobile,
            emailID,
            aadhar
        })
        res.send('User created')
    }
});



router.get("/getusers", async function (req, res) {
    let users = await UserModel.find({});
    res.send(users);
});

router.get("/getuserbyId/:id", async function (req, res) {
    let user = await UserModel.findById({ _id: req.params.id });
    res.send(user);
});

router.post("/update-user", async function (req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const emailID = req.body.email;
    const aadhar = req.body.aadhar;
    const isExist = await UserModel.findOne({ email: req.body.email });

    if (isExist) {
        let userUpdated = await UserModel.updateOne(
            {
                emailID: req.body.email,
            },
            {
                $set: {
                    name: name,
                    address: address,
                    mobile: mobile,
                    emailID: emailID,
                    aadhar: aadhar
                },
            }
        );
        res.send(userUpdated);
    } else {
        res.sendError("User does not exist");
    }
});

module.exports = router;
