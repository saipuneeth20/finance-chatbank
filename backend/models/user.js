const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  accountType: { type: String, required: true, default: 'savings' },
  balance: { type: Number, required: true, default: 50000 },
  password: { type: String, required: true }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Avoid OverwriteModelError during development
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
// This prevents Mongoose from redefining the model if it's already defined.
// The user schema defines the structure of user documents in the MongoDB database.
// It includes fields for name, account number, account type, balance, and password.