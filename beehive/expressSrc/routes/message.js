// routes/message.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messagecontroller');

// Route to send a new message
router.post('/send', messageController.sendMessage);

// Route to retrieve messages for a conversation
router.get('/conversation/:conversationId', messageController.getConversationMessages);

module.exports = router;
