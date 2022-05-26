const mongoose = require("mongoose");
require("../models/order");
require("../models/user");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");
const fs = require('fs');
const path = require('path');
const htmlFilePath = path.join(__dirname, '../order.html');
var content = fs.readFileSync(htmlFilePath, 'utf-8')
module.exports = function () {
    this.pdfSender = async (orderId, user_id) => {
        const orderFound = await OrderModel.findOne({ _id: orderId })
        const userFound = await UserModel.findOne({ _id: user_id })
    }
}