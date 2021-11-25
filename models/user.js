const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  income: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Downloader", "Uploader"],
  },
  balance: {
    type: String,
  },
  creditCardConfirmation: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: {
    type: String,
  },
  userName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicPath: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  verifyCode: String,
  hasPassword: {
    type: Boolean,
    default: false,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
  },

  message: [
    {
      message: String,
      code: String,
      date: String,
    },
  ],
  products: [
    {
      product: {
        type: mongoose.Schema.Types,
        ref: "product",
      },
      type: {
        type: String,
      },
    },
  ],
  downloaded: [
    {
      product: Number,
      size: String,
    },
  ],
});

userSchema.index(
  {
    phone: "text",
    userName: "text",
    firstName: "text",
    lastName: "text",
    email: "text",
  },
  { weights: { phone: 5, userName: 4, firstName: 3, lastName: 2, email: 1 } }
);

module.exports = mongoose.model("user", userSchema);
