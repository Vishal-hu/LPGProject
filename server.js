const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express();
var mongoose = require("mongoose");

var cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000;
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(port, function () {
    console.log("Server is listening at port:" + port);
});


const user = require("./controllers/user");
const admin = require("./controllers/admin");
const otpcalls = require("./controllers/otpcalls");
app.use("/customer", user);
app.use("/admin", admin);
app.use("/otp", otpcalls);

