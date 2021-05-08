const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types, ref: "User"
      },
      code: [{
        time:Number,
        amount:String,
        percent:Number,
        usage:Number,
        discount:[type=String]

      }],

});
module.exports = mongoose.model("discount",discountSchema);