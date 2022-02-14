const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express();
var mongoose = require("mongoose");

var cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 3000;
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
    console.log(process.env.NAME);
})

app.listen(PORT, function () {
    console.log("Server is listening at port:" + PORT);
});


const user = require("./controllers/user");
const product = require("./controllers/product");
app.use("/user", user);
app.use("/product",product);

