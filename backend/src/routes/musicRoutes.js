const express = require("express");
const MusicController = require("../controllers/MusicController"); // 假设你有一个音乐控制器

const router = express.Router();

// 添加音乐偏好
router.post("/add-preference", MusicController.addPreference);

// 获取特定用户的音乐偏好
router.get("/preferences/:userId", MusicController.getUserPreferences);

// 搜索音乐
router.get("/search", MusicController.searchMusic);

module.exports = router;
