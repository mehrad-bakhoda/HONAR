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
  userId: {
    type:Number
  },
  unique_id :{
    type: Number,
    unique: true
  },

  
});
// userSchema.plugin(passportLocalMongoose);
//exporting the userSchema model
module.exports = mongoose.model("message",messageSchema);