const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User"); // Assuming your user model path is this. Adjust if different.

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => done(err, false));
  })
);

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

module.exports = passport;
