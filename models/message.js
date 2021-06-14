//Dependencies & Requirements
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
//using other database models

//Connecting to the DataBase on port 27017
// mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/Art?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//User data base schema
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
// userSchema.plugin(passportLocalMongoose);
//exporting the userSchema model
messageSchema.index({title:"text","message":"text","response":"text"},{weights:{title:6,"user.userName":5,"user.firstName":4,"user.lastName":3,message:2,response:1}});

module.exports = mongoose.model("message",messageSchema);
