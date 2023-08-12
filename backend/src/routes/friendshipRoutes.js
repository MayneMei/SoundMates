const express = require("express");
const router = express.Router();
const friendshipController = require("../controllers/friendshipController"); // 请确保路径是正确的

// 创建友谊关系
router.post("/create", friendshipController.createFriendship);

// 接受/拒绝好友请求
router.patch("/respond/:friendshipID", friendshipController.respondToRequest);

// 获取用户的好友列表
router.get("/list/:userID", friendshipController.getFriends);

// 更新友谊状态
router.patch(
  "/update/:friendshipID",
  friendshipController.updateFriendshipStatus
);

// 获取特定友谊关系的详细信息
router.get("/details/:friendshipID", friendshipController.getFriendshipDetails);

// 删除友谊关系
router.delete("/delete/:friendshipID", friendshipController.deleteFriendship);

// 发送好友请求
router.post("/sendRequest/:userID", friendshipController.sendFriendRequest);

module.exports = router;
