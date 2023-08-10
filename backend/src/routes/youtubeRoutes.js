const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const youtubeRouter = express.Router();

// YouTube授权
youtubeRouter.get("/authorize", (req, res) => {
  const redirect_uri = "YOUR_APP_YOUTUBE_REDIRECT_URL";
  const scope = "DESIRED_YOUTUBE_SCOPES"; // 例如 'https://www.googleapis.com/auth/youtube.readonly'

  res.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth?" +
      querystring.stringify({
        response_type: "code",
        client_id: "YOUR_YOUTUBE_CLIENT_ID",
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
});

// YouTube回调
youtubeRouter.get("/callback", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = "YOUR_APP_YOUTUBE_REDIRECT_URL";

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: "YOUR_YOUTUBE_CLIENT_ID",
        client_secret: "YOUR_YOUTUBE_CLIENT_SECRET",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    // 保存accessToken

    res.redirect("/somewhere-in-your-app");
  } catch (error) {
    console.error("Error in YouTube callback:", error);
    res.status(500).send("Error during authentication");
  }
});

module.exports = youtubeRouter;
