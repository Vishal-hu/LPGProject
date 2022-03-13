const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'user' },
    email:String,
    mobile:String,
    random_number:Number,
    created_at: {
        type: Date,
        default: Date.now
      }
})
mongoose.model('verification',verificationSchema)