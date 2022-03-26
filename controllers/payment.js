const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const config = require('./Paytm/config');
const checksum_lib = require('./Paytm/checksum');
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
require("../models/order");
require("../models/user");
const utilCtrl = require('../utils/util');
const utils = new utilCtrl();
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");


router.post('/paytm', [parseUrl, parseJson], (req, res) => {
  if (!req.body.amount || !req.body.email || !req.body.phone) {
    res.status(400).send('Payment failed')
  } else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = req.body.orderId;
    params['CUST_ID'] = req.body.customerID;
    params['TXN_AMOUNT'] = req.body.amount//.toString();
    params['CALLBACK_URL'] = config.PaytmConfig.callBackUrl;
    params['EMAIL'] = req.body.email;
    params['MOBILE_NO'] = req.body.phone//.toString();


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
      var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
      // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

      var form_fields = "";
      for (var x in params) {
        form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
      }
      form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
      res.end();
    });
  }
})
router.post("/callback", async (req, res) => {
  try {
    if (req.body.STATUS == 'TXN_SUCCESS') {
      const user = await OrderModel.findOneAndUpdate({ _id: req.body.ORDERID }, {
        $set: {
          isPaymentDone: true
        }
      })
      await UserModel.updateOne({ _id: user.user_id }, { $set: { isSubscribed: true } })
      await utils.pdfSender(req.body.ORDERID, user.user_id);
      res.send({ msg: "Payment Done", paymentStatus: req.body.STATUS })
    } else {
      res.send({ msg: "Payment not Done", paymentStatus: req.body.STATUS })
    }
  } catch (error) {
    res.send(error)
  }
  
});

//

const Paytm = require('paytmchecksum');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
router.post('/newPayment',async(req, res)=>{


// var paytmParams = {};


// paytmParams["MID"] = "acNWHP42843987049185";
// paytmParams["ORDERID"] = "123ioi12";


// var paytmChecksum = Paytm.generateSignature(paytmParams, "3BvdZorU8#p0_KE&");
// paytmChecksum.then(function(checksum){
// 	console.log("generateSignature Returns: " + checksum);
// }).catch(function(error){
// 	console.log(error);
// });

//
const https = require('https');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/


var paytmParams = {};

paytmParams.body = {
    "mid"             : "acNWHP42843987049185",
    "merchantOrderId" : "BEKJBJK1231",
    "amount"          : "1303.00",
    "posId"           : "S1234_P1235",
    "userPhoneNo"     : "7777777777"
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
Paytm.generateSignature(JSON.stringify(paytmParams.body), "3BvdZorU8#p0_KE&").then(function(checksum){

    paytmParams.head = {
        "clientId"	: "C11",
        "version"	: "v1",
        "signature"	: checksum
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port   : 443,
        path  : '/order/sendpaymentrequest',
        method : 'POST',
        headers: {
            'Content-Type'  : 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });
    console.log('post_data',post_data);
    post_req.write(post_data);
    post_req.end();
    res.send(post_data)
});        

})
 
//
router.post('/token',async(req, res)=>{
  const https = require('https');

var paytmParams = {};

paytmParams.body = {
    "requestType"   : "Payment",
    "mid"           : config.PaytmConfig.mid,
    "websiteName"   : config.PaytmConfig.website,
    "orderId"       : req.body.orderId,
    "callbackUrl"   : `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${config.PaytmConfig.mid}&orderId=${req.body.orderId}`,
    "txnAmount"     : {
        "value"     : (req.body.amount).toFixed(2),
        "currency"  : "INR",
    },
    "userInfo"      : {
        "custId"    : "CUST_001",
    },
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
Paytm.generateSignature(JSON.stringify(paytmParams.body), `${config.PaytmConfig.key}`).then(function(checksum){

    paytmParams.head = {
        "signature"    : checksum
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/theia/api/v1/initiateTransaction?mid=acNWHP42843987049185&orderId=ORDERID_98765',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            // console.log('Response: ', response);
            res.send(response)
        });
    });

    post_req.write(post_data);
    post_req.end();
    // res.send(response)
});
})
//
module.exports = router