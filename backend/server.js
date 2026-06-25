// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/CSS/JS
app.use(express.static(path.join(__dirname)));  // ✅ Serves files from BankingWeb/

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Default Route
app.get('/', (req, res) => {
  res.send('🚀 Banking backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
// Export app for testing
module.exports = app;  // ✅ Exporting app for testing purposes
// ✅ This allows us to test the server without starting it
// ✅ and to use the same server instance in different environments.