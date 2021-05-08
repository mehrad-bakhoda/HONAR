const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types, ref: "user",
        required: true
      },
    product:{
        type: mongoose.Schema.Types, ref: "product", 
        required: true
    },


});
module.exports = mongoose.model("discount",discountSchema);