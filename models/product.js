const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_name: String,
    product_price: Number,
    product_description:String,
    productImageURL:String,
    created_at: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('product', ProductSchema);