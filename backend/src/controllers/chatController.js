const sendBirdService = require("../utils/sendBirdService");

const chatController = {
  initUser: async (req, res) => {
    try {
      const { userId, nickname } = req.body;
      const user = await sendBirdService.initUser(userId, nickname);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  createDirectChat: async (req, res) => {
    try {
      const { userId } = req.body;
      const channel = await sendBirdService.createDirectChat(userId);
      res.status(200).json({
        status: "success",
        data: {
          channel,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { channelUrl, messageText } = req.body;
      const message = await sendBirdService.sendMessage(
        channelUrl,
        messageText
      );
      res.status(200).json({
        status: "success",
        data: { message },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { channelUrl } = req.query;
      const messages = await sendBirdService.getMessages(channelUrl);
      res.status(200).json({
        status: "success",
        data: { messages },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = chatController;

// const SendBird = require('sendbird');

// const APP_ID = '75D555F7-B9F9-4D21-8774-EEC152564BCB';
// const API_TOKEN = 'f52ed803aed0c483fce2b87285c69b57a3659770';

// const sendbird = new SendBird({ appId: APP_ID });

// // Create a new user or retrieve an existing user
// async function createUser(userId) {
//   try {
//     const user = await sendbird.createUser({ userId });
//     return user;
//   } catch (error) {
//     throw new Error('Error creating user');
//   }
// }

// // Create a new group channel or retrieve an existing one
// async function createGroupChannel(userIds) {
//   try {
//     const channel = await sendbird.GroupChannel.createChannel({ userIds });
//     return channel;
//   } catch (error) {
//     throw new Error('Error creating group channel');
//   }
// }

// // Send a message in a group channel
// async function sendMessage(channelUrl, userId, messageText) {
//   try {
//     const channel = await sendbird.GroupChannel.getChannel(channelUrl);
//     const user = await createUser(userId);

//     const message = await channel.sendUserMessage(messageText, user);
//     return message;
//   } catch (error) {
//     throw new Error('Error sending message');
//   }
// }

// module.exports = {
//   createUser,
//   createGroupChannel,
//   sendMessage,
// };
