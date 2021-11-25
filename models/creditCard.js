
const mongoose = require("mongoose");

const creditCardSchema = new mongoose.Schema({
   cardNumber:{
        type:String,
      },
      name:{
        type:String,
      },
      sId:{
        type:String,
      },
      date:{
        type:Date
      },

  user: {
    type: mongoose.Schema.Types, ref: "User"
  }
  
});

module.exports = mongoose.model("creditCard",creditCardSchema);
