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
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  UserController.login
);

// 用户登出
router.get("/logout", jwtAuth, UserController.logout); // User needs to be authenticated to logout

// 获取当前用户信息
router.get("/profile", jwtAuth, UserController.profile); // User needs to be authenticated to view profile

module.exports = router;
