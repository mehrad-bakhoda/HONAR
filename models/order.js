const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types, ref: "user",
        required: true
      },
    products:[{
        product:{
        type: mongoose.Schema.Types, ref: "product", 
        required: true
        },
        size:{
        type:String,
        }
    }],
});
module.exports = mongoose.model("order",orderSchema);