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

module.exports = router