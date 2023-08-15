const SendBird = require("sendbird");
const sb = new SendBird({ appId: `${process.env.SENDBIRD_APP_ID}` }); // 请替换为你的SendBird App ID

const initUser = async (userId, nickname) => {
  if (!userId || !nickname) {
    throw new Error("Missing required parameters: userId or nickname.");
  }

  return new Promise((resolve, reject) => {
    sb.connect(userId, (user, error) => {
      if (error) {
        reject(new Error(`Failed to connect user. Error: ${error.message}`));
        return;
      }

      sb.updateCurrentUserInfo(nickname, null, (user, error) => {
        if (error) {
          reject(
            new Error(`Failed to update user info. Error: ${error.message}`)
          );
          return;
        }
        resolve(user);
      });
    });
  });
};

const createDirectChat = async (userId) => {
  if (!userId) {
    throw new Error("Missing required parameter: userId.");
  }

  return new Promise((resolve, reject) => {
    const isDistinct = true;

    sb.GroupChannel.createChannelWithUserIds(
      [userId],
      isDistinct,
      (groupChannel, error) => {
        if (error) {
          reject(
            new Error(`Failed to create direct chat. Error: ${error.message}`)
          );
          return;
        }
        resolve(groupChannel);
      }
    );
  });
};

const sendMessage = async (channelUrl, messageText) => {
  if (!channelUrl || !messageText) {
    throw new Error("Missing required parameters: channelUrl or messageText.");
  }

  return new Promise((resolve, reject) => {
    sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
      if (error) {
        reject(new Error(`Failed to get channel. Error: ${error.message}`));
        return;
      }

      groupChannel.sendUserMessage(messageText, "", "", (message, error) => {
        if (error) {
          reject(new Error(`Failed to send message. Error: ${error.message}`));
          return;
        }
        resolve(message);
      });
    });
  });
};

const getMessages = async (channelUrl) => {
  if (!channelUrl) {
    throw new Error("Missing required parameter: channelUrl.");
  }

  return new Promise((resolve, reject) => {
    sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
      if (error) {
        reject(new Error(`Failed to get channel. Error: ${error.message}`));
        return;
      }

      const messageListQuery = groupChannel.createPreviousMessageListQuery();
      messageListQuery.load(20, true, (messageList, error) => {
        if (error) {
          reject(new Error(`Failed to get messages. Error: ${error.message}`));
          return;
        }
        resolve(messageList);
      });
    });
  });
};

module.exports = {
  initUser,
  createDirectChat,
  sendMessage,
  getMessages,
};
