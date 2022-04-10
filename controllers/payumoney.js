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


router.post('/postPayu',async(req, res)=>{
    const status = req.body.status;
    try {
    
        if (status == 'success') {
          const user = await OrderModel.findOneAndUpdate({ _id: req.body.txnid }, {
            $set: {
              isPaymentDone: true
            }
          })
          const userFound = await UserModel.findOneAndUpdate({ _id: user.user_id }, { $set: { isSubscribed: true } })
        //   const filePath = path.join(__dirname,'../order.html')
        //   fs.readFile(filePath)
        //   async function read(err, bucontent){
        //     var content = bucontent.toString();
        //     content = content.replace("$$customerName$$", userFound.name);
        //     pdf.create(content).toBuffer(async function(err, buffer){
        //       if(err) return console.log(err);
        //       var attachments = [
        //         {
        //           fileName :data +".pdf",
        //           content:buffer,
        //           contentType:"application/pdf"
        //         }
        //       ]
        //     })
        //   }
          res.send({ msg: 'successful', Status: req.body.status })
        } else {
          res.send({ success:false, msg: "Unsuccessful" })
        }
    
      } catch (error) {
        res.send(error);
      }
})

module.exports = router