const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/order");
require("../models/user");
require("../models/product");
const UserModel = mongoose.model("user")
const ProductModel = mongoose.model("product");
const OrderModel = mongoose.model("order");

const appName = 'LpgApp';
const version = '1.0';

router.post('/add', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {
            if (req.body.servicename == 'addOrder') {
                const customer_id = req.body.data[0].customerId;
                const productList = req.body.data[0].productId;
                const cartProducts = req.body.data[0].cartProducts;
                const cart_price = req.body.data[0].cart_price;
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
                            cart_price
                        })
                        await UserModel.updateOne({ _id: customer_id }, { $push: { orders: orderCreated[0]._id } })
                        res.send({ success: true, msg: 'order created' })
                    } else {
                        res.send({ success: false, msg: 'Product not found' })
                    }
                } else {
                    res.send({ success: false, msg: 'Customer not found' })
                }
            } else {
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