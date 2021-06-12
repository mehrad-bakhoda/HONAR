const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId:{
      type:Number
    },
    user: {
        type: mongoose.Schema.Types, ref: "User",
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
    },
    date:{
      type:String,
  },
  code:{
    type:String,
}
});
orderSchema.index({code: 'text', 'user.userName': 'text'});
module.exports = mongoose.model("order",orderSchema);