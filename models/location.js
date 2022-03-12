const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location:String,
    admin_id: {type:mongoose.Types.ObjectId,ref: 'admin'},
    created_at: {
        type: Date,
        default: Date.now
      }
})
mongoose.model('location',locationSchema)