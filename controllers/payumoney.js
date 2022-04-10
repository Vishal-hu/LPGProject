const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require('dotenv').config()
require("../models/order");
require("../models/user");
const utilCtrl = require('../utils/util');
const utils = new utilCtrl();
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");

var jsSHA = require("jssha");
router.post('/payUHash', async (req, res) => {
    try {
        if (!req.body.txnid || !req.body.amount || !req.body.productName
            || !req.body.firstname || !req.body.email) {
            res.send("Mandatory fields missing");
        } else {
            var pd = req.body;
            var hashString = process.env.PAYUMERCHANT // Merchant Key 
                + '|' + pd.txnid
                + '|' + pd.amount + '|' + pd.productName + '|'
                + pd.firstname + '|' + pd.email + '|'
                + '||||||||||'
                + process.env.PAYUSALT // Your salt value
            var sha = new jsSHA('SHA-512', "TEXT");
            sha.update(hashString)
            var hash = sha.getHash("HEX");
            res.send({ 'hash': hash });
        }
    } catch (error) {
        console.log('error', error);
    }

})

// router.post('/payUStatusHash', async (req, res) => {
//     var pd = req.body;
//     //Generate new Hash 
//     var hashString = config.payumoney.salt + '|' + pd.status + '||||||||||' + '|' + pd.email + '|' + pd.firstname + '|' + pd.productinfo + '|' + pd.amount + '|' + pd.txnid + '|' + config.payumoney.key
//     var sha = new jsSHA('SHA-512', "TEXT");
//     sha.update(hashString)
//     var hash = sha.getHash("HEX");
//     // Verify the new hash with the hash value in response
//     if (hash == pd.hash) {
//         res.send({ 'status': pd.status });
//     } else {
//         res.send({ 'status': "Error occured" });
//     }
// })

router.post('/postPayu',async(req, res)=>{

})

module.exports = router