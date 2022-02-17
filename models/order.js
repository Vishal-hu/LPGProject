const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    cartProducts: Array,
    order_price: Number,
    created_at: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('order', OrderSchema);