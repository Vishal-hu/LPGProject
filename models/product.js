const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    admin_id: {type:mongoose.Types.ObjectId,ref: 'admin'},
    product_name: String,
    product_price: Number,
    product_description:String,
    productImageURL:Array,
    important_information:String,
    quantity:Number,
    product_size:Number,
    product_type:String,
    created_at: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('product', ProductSchema);