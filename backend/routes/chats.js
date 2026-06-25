const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const User = require('../models/user'); // This is how we access user info if needed

// Log chat
router.post('/log', async (req, res) => {
  const { accountNumber, userMessage, botResponse } = req.body;

  try {
    // Optional: Verify user exists
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newChat = new Chat({
      accountNumber,
      userMessage,
      botResponse
    });

    await newChat.save();

    res.status(201).json({ message: 'Chat saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});
