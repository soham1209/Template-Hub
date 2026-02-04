// back-end/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the "Authorization" header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Decode the token to get the User ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database (Double check they still exist)
      const [rows] = await db.query(
        'SELECT id, name, email FROM users WHERE id = ?', 
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 5. Attach the user info to the request object
      // This is how req.user.id becomes available in your controllers!
      req.user = rows[0];

      next(); // Move to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };