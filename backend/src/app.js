const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const musicRoutes = require("./routes/musicRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const cors = require("cors");

const User = require("./models/User"); // 引入User模型

dotenv.config({ path: "./config.env" });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(
    {
      usernameField: "emailOrUsername",
      passwordField: "password",
    },
    async (emailOrUsername, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
        });
        if (!user) {
          console.log("User not found!");
          return done(null, false, { message: "Incorrect username." });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.log("Password mismatch!");
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in passport strategy:", err);
        done(err);
      }
    }
  )
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (token, tokenSecret, profile, done) {
      // Check against the database, if not existing, then create one, and so on
      // For simplicity, this example only returns the profile.
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/spotify", spotifyRoutes);
app.use("/youtube", youtubeRoutes);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/music", musicRoutes);
app.use("/friendship", friendshipRoutes);

//for spotify authorize test
app.use("/thank-you-for-logging-in", async (req, res) => {
  res.status(200).json({
    message: `get spotify token: ${req.session.spotifyToken}`,
  });
});

module.exports = app;
