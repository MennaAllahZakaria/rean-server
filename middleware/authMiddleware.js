const jwt = require('jsonwebtoken');
const {blacklistedTokens} = require("../controllers/authController");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
      try {
          token = token.split(' ')[1];

          // Check if the token is blacklisted
          if (blacklistedTokens.includes(token)) {
              return res.status(401).json({ message: 'Not authorized, token has been blacklisted' });
          }
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          next();
      } catch (error) {
          return res.status(401).json({ message: 'Not authorized, token failed' });
      }
  } else {
      return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { protect, admin };