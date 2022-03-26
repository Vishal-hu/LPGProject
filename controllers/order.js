const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/order");
require("../models/user");
require("../models/product");
const UserModel = mongoose.model("user");
const ProductModel = mongoose.model("product");
const OrderModel = mongoose.model("order");
const appName = 'LpgApp';
const version = '1.0';

router.post('/order',async (req, res) => {
    const data = req.body
    try {
        if (data.appName == appName && data.version == version) {
            if (data.servicename == 'addOrder') {
                const customer_id = data.data[0].customerId;
                const productList = data.data[0].productId;
                const cartProducts = data.data[0].cartProducts;
                const cart_price = data.data[0].cart_price;
                const totalPrice = data.data[0].totalPrice;
                for (var i = 0; i < (productList || []).length; i++) {
                    var productFound = await ProductModel.findOne({ _id: productList[i] });
                }
                const customerFound = await UserModel.findOne({ _id: customer_id });
                if (customerFound) {
                    if (productFound) {

                        const orderCreated = await OrderModel.insertMany({
                            user_id: customer_id,
                            product_id: productList,
                            cartProducts,
                            cart_price,
                            totalPrice
                        })
                        await UserModel.updateOne({ _id: customer_id }, { $push: { orders: orderCreated[0]._id } })
                    
                        res.send({ success: true, msg: 'order created', order: orderCreated})
                    } else {
                        res.send({ success: false, msg: 'Product not found' })
                    }
                } else {
                    res.send({ success: false, msg: 'Customer not found' })
                }
            } else if (req.body.servicename == 'getOrders') {
                const orders = await OrderModel.find({});
                res.send({ success: true, orders })
            } else if (req.body.servicename == 'getOrdersById') {
                const order_id = req.body.data[0].orderId;
                const orderFound = await OrderModel.findOne({ _id: order_id })
                if (orderFound) {
                    res.send({ success: true, order: orderFound })
                } else {
                    res.send({ success: false, msg: "Order not found for this id" })
                }
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