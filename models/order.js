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
orderSchema.index({"products.fileName":"text","user.userName":"text","user.firstName":"text"},{weights:{"product.fileName":3,"user.userName":2,"user.firstName":1}});
module.exports = mongoose.model("order",orderSchema);