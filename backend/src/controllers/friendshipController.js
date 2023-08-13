const Friendship = require("../models/Friendship");

const friendshipController = {
  // 创建友谊关系
  createOrSendFriendRequest: async (req, res) => {
    try {
      const { user1ID, message } = req.body;
      const user2ID = req.body.user2ID || req.params.userID;

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
        message: `Failed to create friendship: ${error.message}`,
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
      const { status: newStatus } = req.body;

      const currentFriendship = await Friendship.findById(friendshipID);
      const currentStatus = currentFriendship.status;

      const validTransitions = {
        PENDING: ["ACCEPTED", "DECLINED", "BLOCKED"],
        ACCEPTED: ["REMOVED", "BLOCKED"],
        DECLINED: ["BLOCKED"],
        BLOCKED: [], // 从 BLOCKED 的转换将基于 previousStatus
        REMOVED: ["PENDING", "BLOCKED"],
      };

      // 特殊处理 BLOCKED 状态的转换
      if (currentStatus === "BLOCKED") {
        validTransitions.BLOCKED.push(currentFriendship.previousStatus);
      }

      if (!validTransitions[currentStatus].includes(newStatus)) {
        return res.status(400).json({
          status: "fail",
          message: `Cannot transition from ${currentStatus} to ${newStatus}.`,
        });
      }

      const updatedData = {
        status: newStatus,
        updatedAt: new Date(),
        previousStatus: currentStatus,
      };

      const updatedFriendship = await Friendship.findByIdAndUpdate(
        friendshipID,
        updatedData,
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
};

module.exports = friendshipController;
