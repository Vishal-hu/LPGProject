const mongoose = require("mongoose");
require("../models/order");
require("../models/user");
const UserModel = mongoose.model("user");
const OrderModel = mongoose.model("order");
const fs = require('fs');
const path = require('path');
const htmlFilePath = path.join(__dirname, '../order.html');
var content = fs.readFileSync(htmlFilePath, 'utf-8');
const utils = require("./mailutil");
module.exports = function () {
    this.pdfSender = async (orderId, user_id) => {
        let orderFound = await OrderModel.findOne({ _id: orderId })
        orderFound = orderFound.toJSON()
        let userFound = await UserModel.findOne({ _id: user_id })
        userFound = userFound.toJSON()

        content = content.replace("$$customerName$$", userFound.name)
        content = content.replace("$$houseNo$$", orderFound.orderAddress.houseNo)
        content = content.replace("$$block$$", orderFound.orderAddress.block)
        content = content.replace("$$locality$$", orderFound.orderAddress.locality)
        content = content.replace("$$location$$", orderFound.orderAddress.location)
        content = content.replace("$$pincode$$", orderFound.orderAddress.pincode)
        content = content.replace("$$phoneNo$$", userFound.mobile)
        content = content.replace("$$total$$", orderFound.totalPrice)

        async function replaceText() {
            let textContent = ''
            for (var i = 0; i < (orderFound.product_id || []).length; i++) {
                textContent = textContent + `<tr><td>${orderFound.cartProducts[i]}</td><td>${orderFound.quantity[i]}</td><td>${orderFound.product_size[i]}</td><td>${orderFound.cart_price[i]}</td></tr>`
            }
            return textContent
        }
        const replacedText = await replaceText()
        content = content.replace("$$productContent$$", replacedText)
        var options = { format: 'Letter', orientation: "landscape" };
        var pdf = require('html-pdf');
        pdf.create(content, options).toBuffer(async function (err, buffer) {
            if (err) return console.log(err);
            const fileName = (orderFound._id).toJSON()
            var attachments = [
                {
                    fileName: fileName + ".pdf",
                    content: buffer,
                    contentType: "application/pdf",
                },
            ];
            await utils.mailSend(userFound.emailID, 12345, attachments)
        }
        )
    }
}
