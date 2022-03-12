const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:String,
    password:String,
    created_at: {
        type: Date,
        default: Date.now
      }
})
mongoose.model('admin',adminSchema)