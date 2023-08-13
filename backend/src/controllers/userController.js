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
  sendVerificationEmail: async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming you send user's ID as a param

      console.log(userId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found!",
        });
      }

      const verificationURL = `http://localhost:3000/users/verify-email/${user.emailVerificationToken}`;
      const emailInstance = new Email(user, verificationURL);
      await emailInstance.sendWelcome();

      res.status(200).json({
        status: "success",
        message: "Verification email sent!",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

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

      res.status(201).json({
        status: "success",
        message: "User registered! Please verify your email.",
        data: {
          userId: newUser._id, // Send back the new user's ID for the next step
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const token = req.params.token;
      const user = await User.findOne({ emailVerificationToken: token });

      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid or expired verification token.",
        });
      }

      user.emailVerificationToken = null;
      user.isVerified = true;
      await user.save();

      res.json({
        status: "success",
        message: "Email verified successfully!",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "User not found.",
        });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          status: "fail",
          message: "Email not verified. Please verify your email first.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid credentials.",
        });
      }

      const token = generateJWT(user.id);

      req.session.userId = user.id;

      res.json({
        status: "success",
        message: "User logged in!",
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  logout: (req, res) => {
    // For JWT based auth, there isn't a server-side logout.
    // The token has to be removed on the frontend.
    res.json({
      status: "success",
      message:
        "Logout successful. Please ensure the token is removed from the frontend.",
    });
  },

  profile: (req, res) => {
    // Assuming req.user is available after successful JWT verification
    if (req.user) {
      res.json({
        status: "success",
        data: {
          // ... Add any other user details you want to expose
          username: req.user.username,
          email: req.user.email,
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "User not found.",
      });
    }
  },

  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      // Generate a unique token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // Token is valid for 1 hour

      // Store the token and its expiry in the user document
      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpiry = resetTokenExpiry;
      await user.save();

      // Send email with the token
      const resetURL = `http://your-frontend-url/reset-password/${resetToken}`;
      const emailInstance = new Email(user, resetURL);
      await emailInstance.sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Password reset email sent",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;

      const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid or expired token",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear the reset token fields
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    } catch (error) {
      res.status(500).json({
        staus: "error",
        message: error.message,
      });
    }
  },

  findNearbyUsers: async (req, res) => {
    try {
      const { longitude, latitude } = req.body; // 假设你的前端应用发送了当前用户的经纬度
      const maxDistance = 5000; // 5km radius, 你可以根据需求调整

      // 使用地理空间查询找到附近的用户
      const nearbyUsers = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });

      res.status(200).json({
        status: "success",
        data: nearbyUsers,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to find nearby users.",
        error: error.message,
      });
    }
  },
};

module.exports = UserController;
