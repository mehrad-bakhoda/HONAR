//Dependencies & Requirements
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
//using other database models

//Connecting to the DataBase on port 27017
// mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/Art?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//User data base schema
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
        type:String
      },

  user: {
    type: mongoose.Schema.Types, ref: "User"
  }
  
});
// userSchema.plugin(passportLocalMongoose);
//exporting the userSchema model
module.exports = mongoose.model("creditCard",creditCardSchema);
