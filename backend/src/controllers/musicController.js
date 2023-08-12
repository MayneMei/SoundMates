const axios = require("axios");
const MusicPreference = require("../models/Music"); // 假设你有一个音乐偏好的模型

const MusicController = {
  addPreference: async (req, res) => {
    try {
      const { userId, songTitle, artist, album, genre } = req.body;

      const newPreference = new MusicPreference({
        userId,
        songTitle,
        artist,
        album,
        genre,
      });

      await newPreference.save();
      res.status(201).json({ message: "Music preference added!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserPreferences: async (req, res) => {
    try {
      const preferences = await MusicPreference.find({
        userId: req.params.userId,
      });
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchMusic: async (req, res) => {
    const { query, source } = req.query; // 假设你通过查询参数传递搜索关键词和音乐源（如'spotify', 'youtube'）

    try {
      let result;
      switch (source) {
        case "spotify":
          //验证token时效性
          let token = req.session.spotifyToken;

          if (!token) {
            const user = await User.findById(req.user._id);
            if (user && user.refreshToken) {
              token = await refreshSpotifyToken(user.refreshToken);
              req.session.spotifyToken = token;
            } else {
              return res
                .status(401)
                .json({ error: "Spotify authorization required" });
            }
          }
          result = await searchSpotify(query, req.session.spotifyToken);
          break;
        case "youtube":
          result = await searchYoutube(query);
          break;
        // ...可以添加其他音乐源
        default:
          return res.status(400).json({ error: "Unsupported music source" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

async function searchSpotify(query, token) {
  const spotifyAPIEndpoint = "https://api.spotify.com/v1/search";
  try {
    const response = await axios.get(spotifyAPIEndpoint, {
      params: {
        q: query,
        type: "track",
        limit: 10, // 搜索结果的数量
      },
      headers: {
        //TODO: to replace this string with your api key in config.env
        Authorization: `Bearer ${token}`,
      },
    });

    // 将Spotify的响应转换为你的通用格式
    return response.data.tracks.items.map((track) => ({
      songTitle: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      genre: "Unknown", // 提供一个默认值或从Spotify API获取更多信息
    }));
  } catch (error) {
    //throw new Error(`Error searching Spotify: ${error.message}`);
    if (error.response) {
      // 打印来自服务器的响应
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else {
      console.error("Error message:", error.message);
    }
    throw new Error(`Error searching Spotify: ${error.message}`);
  }
}

async function searchYoutube(query) {
  const youtubeAPIEndpoint = "https://www.googleapis.com/youtube/v3/search";

  try {
    const response = await axios.get(youtubeAPIEndpoint, {
      params: {
        q: query,
        part: "snippet",
        type: "video",
        maxResults: 10, // 搜索结果的数量
        //TODO: to replace this string with your api key in config.env
        key: "YOUR_YOUTUBE_API_KEY",
      },
    });

    // 将YouTube的响应转换为你的通用格式
    return response.data.items.map((item) => ({
      songTitle: item.snippet.title,
      artist: item.snippet.channelTitle,
      album: "YouTube Video", // YouTube不提供专辑信息，所以可以设置为默认值或自定义值
      genre: "Unknown", // 提供一个默认值，因为YouTube也不直接提供此信息
    }));
  } catch (error) {
    throw new Error(`Error searching YouTube: ${error.message}`);
  }
}

async function refreshSpotifyToken(refreshToken) {
  const spotifyTokenRefreshEndpoint = "https://accounts.spotify.com/api/token";

  try {
    const response = await axios.post(spotifyTokenRefreshEndpoint, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `YOUR_SPOTIFY_CLIENT_ID:YOUR_SPOTIFY_CLIENT_SECRET`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error(`Error refreshing Spotify token: ${error.message}`);
  }
}

module.exports = MusicController;
