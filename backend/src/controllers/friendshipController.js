const Friendship = require("../models/Friendship");

const friendshipController = {
  // 创建友谊关系
  createFriendship: async (req, res) => {
    try {
      const { user1ID, user2ID, message } = req.body;
      const newFriendship = new Friendship({
        user1ID,
        user2ID,
        status: "PENDING",
        actionUserID: user1ID,
        message,
      });
      const savedFriendship = await newFriendship.save();
      res.status(201).json({
        status: "success",
        data: {
          savedFriendship,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to create friendship.",
      });
    }
  },

  // 接受/拒绝好友请求
  respondToRequest: async (req, res) => {
    try {
      const { friendshipID } = req.params;
      const { status } = req.body;
      const updatedFriendship = await Friendship.findByIdAndUpdate(
        friendshipID,
        { status, updatedAt: new Date() },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        data: { updatedFriendship },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to update friendship status.",
      });
    }
  },

  // 获取用户的好友列表
  getFriends: async (req, res) => {
    try {
      const { userID } = req.params;
      const friends = await Friendship.find({
        $or: [{ user1ID: userID }, { user2ID: userID }],
        status: "ACCEPTED",
      });
      res.status(200).json({
        status: "success",
        data: { friends },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: "Failed to fetch friends.",
      });
    }
  },

  // 更新友谊状态
  updateFriendshipStatus: async (req, res) => {
    try {
      const { friendshipID } = req.params;
      const { status } = req.body;
      const updatedFriendship = await Friendship.findByIdAndUpdate(
        friendshipID,
        { status, updatedAt: new Date() },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        data: {
          updatedFriendship,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to update friendship status.",
      });
    }
  },

  // 获取特定友谊关系的详细信息
  getFriendshipDetails: async (req, res) => {
    try {
      const { friendshipID } = req.params;
      const friendship = await Friendship.findById(friendshipID);
      res.status(200).json({
        status: "success",
        data: {
          friendship,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch friendship details.",
      });
    }
  },

  // 删除友谊关系
  deleteFriendship: async (req, res) => {
    try {
      const { friendshipID } = req.params;
      await Friendship.findByIdAndDelete(friendshipID);
      res.sendStatus(204); // No content
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to delete friendship.",
      });
    }
  },

  // 发送好友请求时的消息
  sendFriendRequest: async (req, res) => {
    try {
      const { userID } = req.params;
      const { user1ID, message } = req.body;
      const newFriendship = new Friendship({
        user1ID,
        user2ID: userID,
        status: "PENDING",
        actionUserID: user1ID,
        message,
      });
      const savedFriendship = await newFriendship.save();
      res.status(201).json({
        status: "success",
        data: {
          savedFriendship,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to send friend request.",
      });
    }
  },
};

module.exports = friendshipController;
