const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
