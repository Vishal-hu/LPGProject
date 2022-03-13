const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/product");
const ProductModel = mongoose.model("product");
require("../models/location");
const LocationModel = mongoose.model("location")

const appName = 'LpgApp';
const version = '1.0';
router.post('/products', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {
            if (req.body.servicename == 'getProducts') {
                const products = await ProductModel.find({})
                res.send({ success: true, products: products })
            }
            //getProductById service
            else if (req.body.servicename == 'getProductById') {
                const id = req.body.productid;
                const productFound = await ProductModel.findOne({ _id: id })
                if (productFound) {
                    res.send({ productFound })
                } else {
                    res.send({ msg: 'Product not Found' })
                }
            }//addProduct service
            else if (req.body.servicename == 'addProduct') {
                const admin_id = req.body.adminId;
                const product_name = (req.body.product_name).toLowerCase();
                const product_price = req.body.product_price;
                const product_description = req.body.product_description;
                const productImageURL = req.body.productImageURL;
                const important_information = req.body.important_information;
                const quantity = req.body.quantity;
                const product_size = req.body.product_size;
                const product_type = req.body.product_type;
                const productFound = await ProductModel.findOne({ product_name: product_name })
                if (productFound) {
                    res.send({ success: false, msg: 'This Product is already added' })
                } else {
                    await ProductModel.insertMany({
                        admin_id,
                        product_name,
                        product_price,
                        product_description,
                        productImageURL,
                        important_information,
                        important_information,
                        quantity,
                        product_size,
                        product_type
                    })
                    res.send({ success: true, msg: 'Product added' })
                }
                //modifyProduct service
            } else if (req.body.servicename == 'modifyProduct') {
                const admin_id = req.body.adminId;
                const product_name = (req.body.product_name).toLowerCase();
                const product_price = req.body.product_price;
                const product_description = req.body.product_description;
                const productImageURL = req.body.productImageURL;
                const important_information = req.body.important_information;
                const quantity = req.body.quantity;
                const product_size = req.body.product_size;
                const product_type = req.body.product_type;

                const productFound = await ProductModel.findOne({ product_name: product_name })
                if (productFound) {
                    await ProductModel.updateOne({
                        product_name: product_name
                    }, {
                        $set: {
                            admin_id: admin_id,
                            product_price: product_price,
                            product_description: product_description,
                            productImageURL: productImageURL,
                            important_information: important_information,
                            quantity: quantity,
                            product_size: product_size,
                            product_type: product_type
                        }
                    })
                    res.send({ success: true, msg: 'Product Updated' })
                } else {
                    res.send({ success: false, msg: 'Product name not matches' })
                }
            }//deleteProduct service
            else if (req.body.servicename == 'deleteProduct') {
                const id = req.body.productId;
                if (id) {
                    const idFound = await ProductModel.findById(id);
                    if (idFound) {
                        await ProductModel.deleteOne({
                            _id: id
                        })
                        res.send({ success: true, msg: 'Product deleted' })
                    } else {
                        res.send({ success: false, msg: 'Requested Id not found' })
                    }
                } else {
                    res.send({ success: false, msg: "Provide an id to be deleted" })
                }//getLocation service
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

router.post('/location', async (req, res) => {
    try {
        if (req.body.appName == appName && req.body.version == version) {
            if (req.body.servicename == 'getLocation') {
                const locationFound = await LocationModel.find({})
                res.send({ success: true, locations: locationFound })
            }//addLocation service 
            else if (req.body.servicename == 'addLocation') {
                const admin_id = req.body.adminId;
                const location = req.body.location;
                if (location == null || location == undefined || location == '') {
                    res.send({ sucess: false, msg: 'please provide a location to be added' })
                } else {
                    await LocationModel.insertMany({
                        admin_id: admin_id,
                        location: location
                    })
                    res.send({ success: true, msg: 'location added' })
                }
            }//removeLocation service
            else if (req.body.servicename == 'removeLocation') {
                const id = req.body.locationId;
                if (id) {
                    const locationFound = await LocationModel.findOne({ _id: id })
                    if (locationFound) {
                        await LocationModel.deleteOne({ _id: id })
                        res.send({ success: true, msg: 'Location deleted' })
                    } else {
                        res.send({ success: false, msg: 'id not found' })
                    }

                } else {
                    res.send({ sucess: false, msg: 'provide an id to be deleted' })
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