const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id:String,
    name: String,
    address: {
        houseNo:String,
        block:String,
        locality:String,
        location:String,
        pincode:Number
    },
    mobile: String,
    emailID: String,
    orders: [{type:mongoose.Types.ObjectId,ref: 'order'}],
    aadhar: String,
    gstNumber:String,
    companyName:String,
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