const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicPreferenceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  songTitle: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MusicPreference", MusicPreferenceSchema);
