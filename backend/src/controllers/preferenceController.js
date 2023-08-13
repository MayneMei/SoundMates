const User = require("../models/User");
const SpotifyController = require("./spotifyController");
const spotifyControllerInstance = new SpotifyController();
const Preference = require("../models/Preference");

//TODO: 对于那些已经通过Spotify认证的用户，可以设定一个定期运行的后台任务（例如，每天运行一次）来更新他们的preferences。这种方法不依赖于用户的任何交互，可以确保数据的时效性

exports.getSpotifyDataForTesting = async (req, res) => {
  try {
    const accessToken = req.session.spotifyToken;
    if (!accessToken) {
      req.session.spotifyToken = getAccessToken(req, res);
    }
    // Fetch data from Spotify
    const topTracks = await spotifyControllerInstance.getTopTracks(accessToken);
    const topArtists = await spotifyControllerInstance.getTopArtists(
      accessToken
    );
    const topGenres = await spotifyControllerInstance.getTopGenres(accessToken);
    const topAlbums = await spotifyControllerInstance.getTopAlbums(accessToken);
    const recentPlays = await spotifyControllerInstance.getRecentMostPlays(
      accessToken
    );

    // Extract only names from the fetched data
    const topTrackNames = topTracks.map((track) => track.name);
    const topArtistNames = topArtists.map((artist) => artist.name);
    // topGenres and topAlbums already return just names based on the previous modifications
    const recentPlayNames = recentPlays.map((track) => track.name);

    // Respond with the names of the fetched data
    res.status(200).json({
      status: "success",
      message: "Successfully fetched Spotify data.",
      data: {
        topTracks: topTrackNames,
        topArtists: topArtistNames,
        topGenres,
        topAlbums,
        recentPlays: recentPlayNames,
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    res.status(500).json({
      status: "error",
      message: `Error fetching Spotify data: \n${error.message}`,
    });
  }
};

exports.getAndUpdateUserPreferences = async (req, res) => {
  try {
    const accessToken = await getAccessToken(req);

    // Fetch data from Spotify
    const topTracks = await spotifyControllerInstance.getTopTracks(accessToken);
    const topArtists = await spotifyControllerInstance.getTopArtists(
      accessToken
    );
    const topGenres = await spotifyControllerInstance.getTopGenres(accessToken);
    const topAlbums = await spotifyControllerInstance.getTopAlbums(accessToken);
    const recentPlays = await spotifyControllerInstance.getRecentPlays(
      accessToken
    );

    // Transform the data
    const preferenceData = transformSpotifyData({
      topTracks,
      topArtists,
      topGenres,
      topAlbums,
      recentPlays,
    });

    // Update the database
    const updatedPreference = await Preference.findOneAndUpdate(
      { userid: req.session.userId },
      preferenceData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "User preferences updated successfully.",
      data: updatedPreference,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({
      status: "error",
      message: `Error updating user preferences: \n${error.message}`,
    });
  }
};

async function getAccessToken(req, res) {
  const user = await User.findById(req.user._id);
  if (user && user.refreshToken) {
    return await refreshSpotifyToken(user.refreshToken);
  } else {
    return res.status(401).json({ error: "Spotify authorization required" });
  }
}

async function transformSpotifyData(data) {
  return {
    userid: req.session.userId,
    topArtists: data.topArtists.map((artist) => ({
      artistName: artist.name,
      artistId: artist.id,
    })),
    topSongs: data.topTracks.map((track) => ({
      songName: track.name,
      songId: track.id,
      artistName: track.artists[0].name,
    })),
    topGenres: data.topGenres,
    recentlyMostPlayed: data.recentPlays.map((track) => ({
      songName: track.name,
      songId: track.id,
      artistName: track.artists[0].name,
    })),
    topAlbums: data.topAlbums.map((album) => ({
      albumName: album.name,
      albumId: album.id,
      artistName: album.artists[0].name,
    })),
  };
}
