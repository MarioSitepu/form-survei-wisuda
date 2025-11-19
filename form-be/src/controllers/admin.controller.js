import jwt from 'jsonwebtoken';
import { ADMIN_PASSWORD, JWT_SECRET } from '../config/config.js';

// In-memory session store (use Redis in production)
const activeSessions = new Set();

export const login = (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Simple password check (use bcrypt in production)
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    activeSessions.add(token);

    res.json({
      message: 'Login successful',
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      activeSessions.delete(token);
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const verifySession = (req, res) => {
  res.json({ 
    authenticated: true, 
    message: 'Session is valid' 
  });
};

export { activeSessions };

