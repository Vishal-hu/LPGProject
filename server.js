const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express();
var mongoose = require("mongoose");
const path = require('path')
var cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000;
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
const db = process.env.DBURL;
// Parses the text as json
app.use(bodyParser.json());

mongoose.connect(
    db,
    {
        useNewUrlParser: true
    },
    function (error) {
        if (error) {
            console.log("Error!" + error);
        } else {
            console.log("Connected with", db);
        }
    }
);

app.get('/index', async (req, res) => {
    res.send('Hello')
})
app.get('/pay', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
    });

app.listen(port, function () {
    console.log("Server is listening at port:" + port);
});


const user = require("./controllers/user");
const admin = require("./controllers/admin");
const otpcalls = require("./controllers/otpcalls");
const order = require("./controllers/order");
const payment = require("./controllers/payment");
app.use("/customer", user);
app.use("/admin", admin);
app.use("/otpcalls", otpcalls);
app.use("/ordercalls", order);
app.use("/payment", payment)