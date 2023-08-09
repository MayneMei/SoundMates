const passport = require("passport");

const authController = {
  // Redirect to Facebook authentication
  redirectToFacebook: passport.authenticate("facebook"),

  // Handle Facebook callback
  handleFacebookCallback: passport.authenticate("facebook", {
    successRedirect: "/profile", // change this to where you'd like users to be redirected upon successful login
    failureRedirect: "/login", // change this to where you'd like users to be redirected upon login failure
  }),

  // Redirect to Google authentication
  redirectToGoogle: passport.authenticate("google", { scope: ["profile"] }),

  // Handle Google callback
  handleGoogleCallback: passport.authenticate("google", {
    successRedirect: "/profile", // adjust accordingly
    failureRedirect: "/login", // adjust accordingly
  }),

  // ... You would add similar methods for WeChat or any other OAuth provider you use.

  // Logout
  logout: (req, res) => {
    req.logout();
    res.redirect("/login");
  },

  // Optional: Add a profile handler if you wish to see user's profile after logging in
  getProfile: (req, res) => {
    res.send(req.user); // send user details to client
  },
};

module.exports = authController;
