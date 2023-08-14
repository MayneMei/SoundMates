const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Route to create a new group channel
router.post("/create-channel", async (req, res) => {
  const { userIds } = req.body;
  console.log(userIds);
  try {
    const channel = await chatController.createGroupChannel(userIds);
    res.json({ success: true, channel });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ success: false, error: 'Error creating channel' });
  }
});

// Route to send a message in a channel
router.post("/send-message", async (req, res) => {
  const { channelUrl, userId, messageText } = req.body;
  
  try {
    const message = await chatController.sendMessage(channelUrl, userId, messageText);
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Error sending message' });
  }
});

module.exports = router;
