const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/product");
const ProductModel = mongoose.model("product");

router.get('/get-products', async (req, res) => {
    const productFound = await ProductModel.find({})
    res.send({ productFound })
})

router.get('/getProductById', async (req, res) => {
    const id = req.query.id;
    const productFound = await ProductModel.findById(id)
    if (productFound) {
        res.send({ productFound })
    } else {
        res.send({ msg: 'Product not Found' })
    }
})

router.post('/add-product', async (req, res) => {
    const product_name = (req.body.product_name).toLowerCase();
    const product_price = req.body.product_price;
    const product_description = req.body.product_description;
    const productImageURL = req.body.productImageURL;

    const productFound = await ProductModel.findOne({ product_name: product_name })
    if (productFound) {
        res.send({ msg: 'This Product is already added' })
    } else {
        await ProductModel.insertMany({
            product_name,
            product_price,
            product_description,
            productImageURL
        })
        res.send({ msg: 'Product added' })
    }

})

router.post('/modify-product', async (req, res) => {
    const product_name = (req.body.product_name).toLowerCase();
    const product_price = req.body.product_price;
    const product_description = req.body.product_description;
    const productImageURL = req.body.productImageURL;

    const productFound = await ProductModel.findOne({ product_name: product_name })
    if (productFound) {
        await ProductModel.updateOne({
            product_name: product_name
        }, { $set: { product_price: product_price, product_description: product_description, productImageURL: productImageURL } })
        res.send({ msg: 'Product Updated' })
    } else {
        res.send({ msg: 'Product name not matches' })
    }
})
router.get('/delete-product', async (req, res) => {
    const id = req.query.id;
    if (id) {
        const idFound = await ProductModel.findById(id);
        if (idFound) {
            await ProductModel.deleteOne({
                _id: id
            })
            res.send({ msg: 'Product deleted' })
        } else {
            res.send({ msg: 'Requested Id not found' })
        }
    } else {
        res.send({ msg: "Provide an id to be deleted" })
    }

})
module.exports = router;