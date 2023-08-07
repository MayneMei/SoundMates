const User = require("../models/User"); // 假设你有一个用户模型
const bcrypt = require("bcryptjs"); // 使用bcrypt来加密密码

const UserController = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: "User registered!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: (req, res) => {
    res.json({ message: "User logged in!", user: req.user });
  },

  logout: (req, res) => {
    req.logout();
    res.json({ message: "User logged out!" });
  },

  profile: (req, res) => {
    // 返回用户的详细信息，但这里假设我们只返回用户名
    res.json({ username: req.user.username });
  },
};

module.exports = UserController;
