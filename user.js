//Dependencies & Requirements
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
//using other database models

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//User data base schema
const userSchema = new mongoose.Schema({
  unique_id : Number,
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: {
    type: String
  },
  userName:{
    type:String
  },
  lastName: {
    type: String
  },
  university: {
    type: String
  },
  studyField: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    sparse:true
  },
  password:{
    type:String
  },

  verifyCode: Number,
  hasPassword:Boolean,
  registered: Boolean,
  verified: Boolean,

});
// userSchema.plugin(passportLocalMongoose);
//exporting the userSchema model
module.exports = mongoose.model("user",userSchema);
