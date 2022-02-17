const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    address: String,
    mobile: String,
    emailID: String,
    orders: [{type:mongoose.Types.ObjectId,ref: 'order'}],
    aadhar: String,
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