const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/location");
const LocationModel = mongoose.model("location")

router.get('/get-location', async (req, res) => {
    const locationFound = await LocationModel.find({})
    res.send (locationFound )
})

router.post('/add-location', async (req, res) => {
    const location = req.body.location;
    if (location == null || location == undefined || location == '') {
        res.send({ msg: 'please provide a location to be added' })
    } else {
        await LocationModel.insertMany({
            location: location
        })
        res.send({ msg: 'location added' })
    }
})

router.get('/remove-location', async (req, res) => {
    const id = req.query.id;
    if (id) {
        const locationFound = await LocationModel.findOne({ _id: id })
        if (locationFound) {
            await LocationModel.deleteOne({ _id: id })
            res.send({ msg: 'Location deleted' })
        } else {
            res.send({ msg: 'id not found' })
        }

    } else {
        res.send({ msg: 'provide an id to be deleted' })
    }
})

module.exports = router