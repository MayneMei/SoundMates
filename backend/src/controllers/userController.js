const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const Email = require("../utils/email");

dotenv.config();

const generateJWT = (userId) => {
  const payload = { userId: userId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const UserController = {
  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        emailVerificationToken,
      });

      await newUser.save();

      const verificationURL = `http://localhost:3000/users/verify-email/${emailVerificationToken}`;

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

      user.emailVerificationToken = null;
      user.isVerified = true;
      await user.save();

      res.json({ message: "Email verified successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      const token = generateJWT(user.id);

      req.session.userId = user.id;

      res.json({ message: "User logged in!", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    // For JWT based auth, there isn't a server-side logout.
    // The token has to be removed on the frontend.
    res.json({
      message:
        "Logout successful. Please ensure the token is removed from the frontend.",
    });
  },

  profile: (req, res) => {
    // Assuming req.user is available after successful JWT verification
    if (req.user) {
      res.json({
        username: req.user.username,
        email: req.user.email,
        // ... Add any other user details you want to expose
      });
    } else {
      res.status(400).json({ error: "User not found." });
    }
  },
};

module.exports = UserController;
