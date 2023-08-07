const MusicPreference = require("../models/Music"); // 假设你有一个音乐偏好的模型

const MusicController = {
  addPreference: async (req, res) => {
    try {
      const { userId, songTitle, artist } = req.body;

      const newPreference = new MusicPreference({
        userId,
        songTitle,
        artist,
      });

      await newPreference.save();
      res.status(201).json({ message: "Music preference added!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserPreferences: async (req, res) => {
    try {
      const preferences = await MusicPreference.find({
        userId: req.params.userId,
      });
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchMusic: (req, res) => {
    // 搜索音乐的逻辑，例如从第三方API检索歌曲信息
  },
};

module.exports = MusicController;
