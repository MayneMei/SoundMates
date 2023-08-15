const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const musicRoutes = require("./routes/musicRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

// 引入配置好的passport实例
const passportConfig = require("./middleware/passportConfig");

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes

app.use("/spotify", spotifyRoutes);
app.use("/youtube", youtubeRoutes);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/music", musicRoutes);
app.use("/friendship", friendshipRoutes);
app.use("/chat", chatRoutes);

//for spotify authorize test
app.use("/thank-you-for-logging-in", async (req, res) => {
  res.status(200).json({
    message: `get spotify token: ${req.session.spotifyToken}`,
  });
});

module.exports = app;
