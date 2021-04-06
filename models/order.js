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
    quantity: {
        type: Number,
      },
    totalPrice: {
        type: Number,
      },
    status:{
        type:String,
    }
});
module.exports = mongoose.model("order",orderSchema);