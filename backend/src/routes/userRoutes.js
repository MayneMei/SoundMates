const express = require("express");
const passport = require("passport");
const UserController = require("../controllers/userController");

const router = express.Router();

// Middleware to require JWT authentication
const jwtAuth = passport.authenticate("jwt", { session: false });

// 用户注册
router.post("/register", UserController.register);

// 邮箱验证
router.get("/verify-email/:token", UserController.verifyEmail);

// 用户登录
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: "Bad request" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return UserController.login(req, res);
    });
  })(req, res, next);
});

// 用户登出
router.get("/logout", jwtAuth, UserController.logout); // User needs to be authenticated to logout

// 获取当前用户信息
router.get("/profile", jwtAuth, UserController.profile); // User needs to be authenticated to view profile

module.exports = router;
