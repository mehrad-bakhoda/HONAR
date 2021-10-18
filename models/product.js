//Dependencies & Requirements
const mongoose = require("mongoose");

//Connecting to the DataBase on port 27017
// mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/Art?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//course notes data base Schema
const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    unique: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["graphic", "clip", "photo", "gif"],
  },
  dimensions: {
    type: String,
  },
  session: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  artist: {
    type: String,
  },
  filePath: [
    {
      filePath: String,
      fileType: String,
    },
  ],
  fileType: {
    type: String,
  },
  coverPath: {
    type: String,
  },
  rating: {
    type: Number,
    //rating method for our Course note 1 is the worst and 5 is the best
    min: 1,
    max: 5,
  },
  downloadedCount: {
    type: Number,
    default: 0,
  },
  orginalPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  largePrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  mediumPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  smallPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  date: {
    type: Date,
  },
  fileTypes: [
    {
      type: String,
    },
  ],
  confirmation: {
    type: Boolean,
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  user: {
    type: mongoose.Schema.Types,
    ref: "User",
  },
});

productSchema.index(
  {
    type: "text",
    fileName: "text",
    "user.userName": "text",
    tags: "text",
    "user.firstName": "text",
    fileType: "text",
  },
  {
    weights: {
      fileName: 6,
      tags: 5,
      fileType: 4,
      type: 3,
      "user.userName": 2,
      "user.firstName": 1,
    },
  }
);
// productSchema.statics = {
//   searchPartial: function(q, callback) {
//       return this.find({
//           $or: [
//               { "fileName": new RegExp(q, "gi") },
//               { "user.userName": new RegExp(q, "gi") },
//               { "tags": new RegExp(q, "gi") },
//               { "user.firstName": new RegExp(q, "gi") },
//               { "fileType": new RegExp(q, "gi") },
//               { "type": new RegExp(q, "gi") },
//           ]
//       }, callback);
//   },

//   searchFull: function (q, callback) {
//       return this.find({
//           $text: { $search: q, $caseSensitive: false }
//       }, callback)
//   },

//   search: function(q, callback) {
//       this.searchFull(q, (err, data) => {
//           if (err) return callback(err, data);
//           if (!err && data.length) return callback(err, data);
//           if (!err && data.length === 0) return this.searchPartial(q, callback);
//       });
//   },
// }

//exporting noteSchema model
module.exports = mongoose.model("product", productSchema);
