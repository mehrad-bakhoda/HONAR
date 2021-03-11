//Dependencies & Requirements
const mongoose = require("mongoose");

//Connecting to the DataBase on port 27017
mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/Art?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//course notes data base Schema
const productSchema = new mongoose.Schema({
  productId : {
    type:Number,
    unique: true
  },
  fileName : {
    type :String,
    required : true
  },
  type:{
    type:String,
    enum:["graphic","clip","photo"]
  },
  dimensions:{
    type:String,

  },
  session:{
    type: String,
  },
  tags: [{
    type: String,
  }],
  description:{
    type: String,
  },
  artist:{
    type: String,
  },
  filePath:{
    type: String,
    required:true
  },
  coverPath:{
    type: String,
  },
  rating: {
    type: Number,
    //rating method for our Course note 1 is the worst and 5 is the best
    min: 1,
    max: 5
  },
  downloadedCount: {
    type:Number,
    default:0
  },
  price: {
    type: Number,
    min: 0,
    default:0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId, ref: "comment"
  }],
  user: {
    type: mongoose.Schema.Types, ref: "user"
  }

});
productSchema.index({fileType:"text",fileName:"text",subject:"text",field:"text",university:"text",teacher:"text",writer:"text"});

//exporting noteSchema model
module.exports =  mongoose.model("product", productSchema);
