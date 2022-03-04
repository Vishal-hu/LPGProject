const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location:String,
    created_at: {
        type: Date,
        default: Date.now
      }
})
mongoose.model('location',locationSchema)