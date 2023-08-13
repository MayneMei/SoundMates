const express = require("express");

const passport = require("../middleware/passportConfig");
const UserController = require("../controllers/userController");
const preferenceController = require("../controllers/preferenceController"); // Import the preference controller

const router = express.Router();

// Middleware to require JWT authentication
const jwtAuth = passport.authenticate("jwt", { session: false });

// 用户注册
router.post("/register", UserController.register);

//发送验证邮件
router.post(
  "/send-verification-email/:userId",
  UserController.sendVerificationEmail
);

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

// 更新用户偏好
router.post(
  "/update-preferences",
  preferenceController.getAndUpdateUserPreferences
);

router.get(
  "/get-spotify-data-for-testing",
  preferenceController.getSpotifyDataForTesting
);

// 用户重置密码
router.post("/request-password-reset", UserController.requestPasswordReset);
router.post("/reset-password", UserController.resetPassword);

//查询“附近的人”
const authenticate = passport.authenticate("jwt", { session: false });
router.post("/nearby", authenticate, UserController.findNearbyUsers);

module.exports = router;
