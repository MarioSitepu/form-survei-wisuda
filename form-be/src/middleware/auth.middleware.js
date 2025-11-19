import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import { activeSessions } from '../controllers/admin.controller.js';

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Check if session is active
    if (!activeSessions.has(token)) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.admin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      activeSessions.delete(req.headers.authorization?.replace('Bearer ', ''));
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

