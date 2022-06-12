const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/version");
require("../models/tax");
const VersionModel = mongoose.model("version");
const TaxModel = mongoose.model("tax");
const appName = 'LpgApp';
const version = '1.0';

router.post('/utils', async (req, res) => {
    const data = req.body
    try {
        if (data.appName == appName && data.version == version) {
            if (data.servicename == 'addVersion') {
                const { latestVersion, url } = data.data[0];
                await VersionModel.insertMany({
                    latestVersion,
                    url
                })
                res.send({ success: true, msg: 'new version inserted successfully' })
            } else if (data.servicename == 'latest-version') {
                const data = await VersionModel.find({}).sort({ created_at: -1 }).select(['latestVersion', 'url'])
                res.send({ success: true, data: data[0] })
            } else if (data.servicename == 'all-versions') {
                const data = await VersionModel.find({})
                res.send({ success: true, data })
            } else if (data.servicename == 'addTax') {
                const { tax,
                    tax_description,
                    commercial_tax,
                    commercial_tax_description,
                    free_delivery_description,
                    standard_delivery_price,
                    standard_delivery_description }
                    = data.data[0];
                await TaxModel.insertMany({
                    tax,
                    tax_description,
                    commercial_tax,
                    commercial_tax_description,
                    free_delivery_description,
                    standard_delivery_price,
                    standard_delivery_description
                })
                res.send({ success: true, msg: 'new taxes inserted successfully' })
            } else if (data.servicename == 'latest-taxes') {
                const data = await TaxModel.find({}).sort({ created_at: -1 })
                    .select(['tax', 'tax_description', 'commercial_tax', 'commercial_tax_description',
                        'free_delivery_description', 'standard_delivery_price', 'standard_delivery_description'])
                res.send({ success: true, data: data[0] })
            } else if (data.servicename == 'all-taxes') {
                const data = await TaxModel.find({})
                res.send({ success: true, data })
            } else {
                res.send({ success: false, msg: 'Please! provide a valid servicename' })
            }
        } else {
            res.send({ success: false, msg: 'Invalid AppName or Version' })
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;