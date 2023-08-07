const User = require("../models/User"); // 假设你有一个用户模型
const bcrypt = require("bcryptjs"); // 使用bcrypt来加密密码
const jwt = require("jsonwebtoken"); //使用jwt来当签名令牌
const dotenv = require("dotenv");
dotenv.config();

const UserController = {
  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, email });

      await newUser.save();
      res.status(201).json({ message: "User registered!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      console.log(req.body);
      const { emailOrUsername, password } = req.body;

      // 在数据库中查找用户，用户名或电子邮件匹配
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        return res.status(400).json({ error: "no user" });
      }

      // 比较密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // 生成JWT
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "User logged in!", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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
