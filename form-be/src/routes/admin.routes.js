import express from 'express';
import { login, logout, verifySession } from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', login);

// POST /api/admin/logout - Admin logout
router.post('/logout', logout);

// GET /api/admin/verify - Verify admin session
router.get('/verify', authenticateAdmin, verifySession);

export default router;

