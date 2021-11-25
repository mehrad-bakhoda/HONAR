
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   message:{
        type:String,
      },
      user: {
        type: mongoose.Schema.Types, ref: "User"
      },
  unique_id :{
    type: Number,
    unique: true
  },
  response:{
    type:String,
  },
  date:{
    type:Date
  },
  answeredDate:{
    type:Date
  },

  title:{
    type:String
  },answered:{
    type:Boolean
  }

  
});

messageSchema.index({title:"text","message":"text","response":"text"},{weights:{title:6,"user.userName":5,"user.firstName":4,"user.lastName":3,message:2,response:1}});

module.exports = mongoose.model("message",messageSchema);
