const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({

  unique_id :{
    type: Number,
    unique: true
  },
  userId: {
    type:Number
  },
 amount :{
    type: String,
  },
  fromDate :{
    type: String,
  },
  toDate :{
    type: String,
  },
  code:{
    type:String
  }

});
module.exports = mongoose.model("discount",discountSchema);