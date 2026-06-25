// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Transaction = require('../models/transaction'); // <-- required for transaction history

// Generate a 12-digit account number
function generateAccountNumber() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// ----------- SIGNUP ----------
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      accountNumber: generateAccountNumber(),
      accountType: 'Savings',
      balance: 50000
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        accountNumber: newUser.accountNumber,
        accountType: newUser.accountType,
        balance: newUser.balance
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ----------- LOGIN ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid email or password' });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        accountType: user.accountType,
        balance: user.balance
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ----------- GET USER DETAILS BY ACCOUNT NUMBER ----------
router.get('/user/:accountNumber', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      accountNumber: user.accountNumber,
      accountType: user.accountType,
      balance: user.balance,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------- GET TRANSACTION HISTORY ----------
router.get('/transactions/:accountNumber', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { senderAccount: req.params.accountNumber },
        { receiverAccount: req.params.accountNumber }
      ]
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// ----------- GET MONTHLY INCOME & EXPENSE (BAR GRAPH DATA) ----------
router.get('/bargraph/:accountNumber', async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { senderAccount: accountNumber },
            { receiverAccount: accountNumber }
          ],
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $addFields: {
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          type: {
            $cond: [
              { $eq: ["$senderAccount", accountNumber] },
              "expense",
              "income"
            ]
          }
        }
      },
      {
        $group: {
          _id: { month: "$month", type: "$type" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Format result into usable format
    const grouped = {};
    transactions.forEach(t => {
      const month = t._id.month;
      if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
      grouped[month][t._id.type] = t.total;
    });

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating graph data' });
  }
});

module.exports = router;
