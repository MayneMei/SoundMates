const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const spotifyRouter = express.Router();

// Spotify授权
spotifyRouter.get("/authorize", (req, res) => {
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const scope = "user-read-private,playlist-read-private"; // 例如 'user-read-private user-read-email' ???这里暂时不知道是干嘛的

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
});

// Spotify回调
spotifyRouter.get("/callback", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    //TODO:保存accessToken，例如在session或其他地方
    const accessToken = response.data.access_token;
    req.session.spotifyToken = accessToken;
    //TODO: 确认合适的重定向url
    res.redirect("/thank-you-for-logging-in"); // 根据需要进行重定向
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    res.status(500).send("Error during authentication");
  }
});

module.exports = spotifyRouter;
