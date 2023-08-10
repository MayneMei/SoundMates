const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const musicShareSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming your user model name is 'User'
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  music: {
    type: Schema.Types.ObjectId,
    ref: "MusicPreference", // Or 'Music', depending on your model's name
    required: true,
  },
  dateShared: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    default: "",
  },
});

const MusicShare = mongoose.model("MusicShare", musicShareSchema);

module.exports = MusicShare;
