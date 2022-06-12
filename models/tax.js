const mongoose = require('mongoose');

const TaxSchema = new mongoose.Schema({
    tax: String,
    tax_description: String,
    commercial_tax: String,
    commercial_tax_description: String,
    free_delivery_description: String,
    standard_delivery_price: String,
    standard_delivery_description: String,
    created_at: {
        type: Date,
        default: Date.now
    },
});
mongoose.model('tax', TaxSchema);