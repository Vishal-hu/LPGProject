const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
    latestVersion: String,
    url: String,
    created_at: {
        type: Date,
        default: Date.now
    },
});
mongoose.model('version', VersionSchema);