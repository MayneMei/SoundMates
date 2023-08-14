const SendBird = require('sendbird');

const APP_ID = '75D555F7-B9F9-4D21-8774-EEC152564BCB';
const API_TOKEN = 'f52ed803aed0c483fce2b87285c69b57a3659770';

const sendbird = new SendBird({ appId: APP_ID });

// Create a new user or retrieve an existing user
async function createUser(userId) {
  try {
    const user = await sendbird.createUser({ userId });
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
}

// Create a new group channel or retrieve an existing one
async function createGroupChannel(userIds) {
  try {
    const channel = await sendbird.GroupChannel.createChannel({ userIds });
    return channel;
  } catch (error) {
    throw new Error('Error creating group channel');
  }
}

// Send a message in a group channel
async function sendMessage(channelUrl, userId, messageText) {
  try {
    const channel = await sendbird.GroupChannel.getChannel(channelUrl);
    const user = await createUser(userId);
    
    const message = await channel.sendUserMessage(messageText, user);
    return message;
  } catch (error) {
    throw new Error('Error sending message');
  }
}

module.exports = {
  createUser,
  createGroupChannel,
  sendMessage,
};


