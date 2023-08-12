const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema({
  friendshipID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  user1ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "DECLINED", "BLOCKED", "REMOVED"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  actionUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String },
});

const Friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = Friendship;
