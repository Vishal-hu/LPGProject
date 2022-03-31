const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_id: { type:String, ref: 'user' },
    product_id: [{ type: mongoose.Types.ObjectId, ref: 'product' }],
    cartProducts: Array,
    cart_price: [Number],
    quantity:[Number],
    isPaymentDone:{
        type:Boolean,
        default:false
    },
    totalPrice:Number,
    created_at: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('order', OrderSchema);