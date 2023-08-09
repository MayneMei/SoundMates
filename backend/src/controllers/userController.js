const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const Email = require("../utils/email"); // Assuming you have implemented this utility function

dotenv.config();

const UserController = {
  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword = await bcrypt.hash("hello" + password, 10);
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        emailVerificationToken,
      });

      await newUser.save();

      const verificationURL = `http://localhost:3000/users/verify-email/${emailVerificationToken}`;

      // Instantiate the Email class and send the verification email
      const emailInstance = new Email(newUser, verificationURL);
      await emailInstance.sendWelcome();

      res.status(201).json({
        message: "User registered! Please verify your email.",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const token = req.params.token;
      const user = await User.findOne({ emailVerificationToken: token });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired verification token." });
      }

      user.verificationToken = null;
      user.isVerified = true; // Assuming your User model has this field
      await user.save();

      res.json({ message: "Email verified successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      console.log(req.body);
      const { emailOrUsername, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        return res.status(400).json({ error: "User not found." });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          error: "Email not verified. Please verify your email first.",
        });
      }

      const isMatch = await bcrypt.compare("hello" + password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

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
    res.json({ username: req.user.username });
  },
};

module.exports = UserController;
