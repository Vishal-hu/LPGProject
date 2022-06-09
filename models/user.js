const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    address: {
        houseNo: String,
        block: String,
        locality: String,
        location: String,
        pincode: Number
    },
    mobile: String,
    emailID: String,
    orders: [{ type: mongoose.Types.ObjectId, ref: 'order' }],
    aadhar: { type: String, default: 'NA' },
    gstNumber: { type: String, default: 'NA' },
    companyName: { type: String, default: 'NA' },
    created_at: {
        type: Date,
        default: Date.now
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
});
mongoose.model('user', UserSchema);