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
  spotifyRefreshToken: {
    type: String, // Token typically is a string
    default: null, // By default, it can be null
  },
  passwordResetToken: {
    type: String,
    default: "",
  },
  passwordResetTokenExpiry: Date,
  //
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
});

// Optional: Add a 2dsphere index if you plan to run geospatial queries in Mongoose
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
