const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const User = require('../models/user');

// Add new transaction
router.post('/add', async (req, res) => {
  const { accountNumber, type, amount, description } = req.body;

  try {
    // Find user by account number
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create transaction
    const transaction = new Transaction({
      userId: user._id,
      type,
      amount,
      description,
    });

    await transaction.save();

    // Update balance
    if (type === 'credit') user.balance += amount;
    else if (type === 'debit') user.balance -= amount;

    await user.save();

    res.status(201).json({ message: 'Transaction added', transaction, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get transactions by account number
router.get('/:accountNumber', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// This code defines the transaction routes for adding new transactions and fetching transactions by account number.
// It uses Express.js to handle HTTP requests and Mongoose to interact with MongoDB.