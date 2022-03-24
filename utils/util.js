const mongoose = require("mongoose");
require("../models/order");
require("../models/user");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");

module.exports = function(){
    this.pdfSender = async(orderId, user_id) =>{
        const orderFound = await OrderModel.findOne({_id:orderId})
        const userFound = await UserModel.findOne({_id:user_id})
    }
}