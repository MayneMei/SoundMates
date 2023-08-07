const express = require("express");
const passport = require("passport");
const UserController = require("../controllers/UserController"); // 假设你有一个用户控制器

const router = express.Router();

// 用户注册
router.post("/register", UserController.register);

// 用户登录
router.post("/login", passport.authenticate("local"), UserController.login);

// 用户登出
router.get("/logout", UserController.logout);

// 获取当前用户信息
router.get("/profile", UserController.profile);

module.exports = router;
