const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const UserRoutes = require("./routes/userRoutes");
const AuthRoutes = require("./routes/authRoutes");
const User = require("./models/User"); // 引入User模型

dotenv.config({ path: "./config.env" });

const app = express();

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
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", UserRoutes);
app.use("/auth", AuthRoutes);

module.exports = app;
