// controllers/messageController.js

const Message = require('../database/schemas/messagedb');

// Controller for sending a new message
const sendMessage = async (req, res) => {
  const { content, senderId, conversationId, timestamp } = req.body;

  try {
    const newMessage = new Message({
      content,
      senderId,
      conversationId,
      timestamp: new Date(), // Set the timestamp as the current time
    });

    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Controller for retrieving messages for a conversation
const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = {
  sendMessage,
  getConversationMessages,
};
