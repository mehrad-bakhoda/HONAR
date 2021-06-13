const mongoose = require("mongoose");

const purchasesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types, ref: "user",
        required: true
      },
    product:{
        type: mongoose.Schema.Types, ref: "product", 
        required: true
    },
    size:[{
        type:String,
    }],
    date:{
        type:Date
    }

});


module.exports = mongoose.model("purchases",purchasesSchema);