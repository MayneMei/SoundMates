const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maxFiveElements = (val) => val.length <= 5;

const PreferenceSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  topArtists: {
    type: [
      {
        artistName: String,
        artistId: String,
      },
    ],
    validate: [maxFiveElements, "{PATH} exceeds the limit of 5 elements."],
    default: [],
  },
  topSongs: {
    type: [
      {
        songName: String,
        songId: String,
        artistName: String,
      },
    ],
    validate: [maxFiveElements, "{PATH} exceeds the limit of 5 elements."],
    default: [],
  },
  recentlyMostPlayed: {
    type: [
      {
        songName: String,
        songId: String,
        artistName: String,
      },
    ],
    validate: [maxFiveElements, "{PATH} exceeds the limit of 5 elements."],
    default: [],
  },
  topAlbums: {
    type: [
      {
        albumName: String,
        albumId: String,
        artistName: String,
      },
    ],
    validate: [maxFiveElements, "{PATH} exceeds the limit of 5 elements."],
    default: [],
  },
  topGenres: {
    type: [String],
    validate: [maxFiveElements, "{PATH} exceeds the limit of 5 elements."],
    default: [],
  },
});

module.exports = mongoose.model("Preference", PreferenceSchema);
