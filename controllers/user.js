const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/user");
require("../models/order");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");

router.post("/add-user", async function (req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const emailID = req.body.email;
    const aadhar = req.body.aadhar;
    const order = req.body.orders;
    let isExist = await UserModel.findOne({
        email: req.body.email,
    });
    if (isExist) {
        const insertedOrder = await OrderModel.insertMany({
            cartProducts: order[0].cartProducts,
            order_price: order[0].order_price
        })
        await UserModel.updateOne({ emailID: emailID }, { $push: { orders: insertedOrder[0]._id } })
        res.send({msg:"Order Saved"});
    } else {
        const insertedOrder = await OrderModel.insertMany({
            cartProducts: order[0].cartProducts,
            order_price: order[0].order_price
        })
        await UserModel.insertMany({
            name,
            address,
            mobile,
            emailID,
            aadhar,
            orders: insertedOrder[0]._id
        })
        res.send({msg:'Order Saved'})
    }
});



router.get("/getusers", async function (req, res) {
    let users = await UserModel.find({}).populate("orders");
    res.send(users);
});

router.get("/getuserbyId", async function (req, res) {
    const id = req.query.id;
    let user = await UserModel.findById({ _id: id }).populate("orders");
    res.send(user);
});

router.post("/update-user", async function (req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const emailID = req.body.email;
    const aadhar = req.body.aadhar;
    const isExist = await UserModel.findOne({ emailID: emailID });

    if (isExist) {
        let userUpdated = await UserModel.updateOne(
            {
                emailID: emailID,
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
        res.send({msg:"User does not exist"});
    }
});

module.exports = router;
