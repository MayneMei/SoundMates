const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: "",
  },
  emailVerificationTokenExpires: Date,
  thirdPartyAuth: {
    googleId: String,
    facebookId: String,
    wechatId: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
