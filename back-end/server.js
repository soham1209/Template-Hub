const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const templateRoutes = require('./routes/templateRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your React Frontend
app.use(express.json()); // Parse JSON bodies
app.use('/api/auth', authRoutes);


// Routes
app.use('/api/templates', templateRoutes);
app.use('/api/email', emailRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('MailForge API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});