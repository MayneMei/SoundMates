const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Facebook OAuth routes
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// WeChat OAuth routes (assuming you're using a strategy for WeChat)
// router.get("/wechat", passport.authenticate("wechat"));

// router.get(
//   "/wechat/callback",
//   passport.authenticate("wechat", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect('/profile');
//   }
// );

module.exports = router;
