import express from 'express';
import { 
  getResponses, 
  addResponse, 
  getResponseById,
  deleteResponse 
} from '../controllers/response.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/responses - Get all responses (admin only)
router.get('/', authenticateAdmin, getResponses);

// GET /api/responses/:id - Get response by ID (admin only)
router.get('/:id', authenticateAdmin, getResponseById);

// POST /api/responses - Add new response (public)
router.post('/', addResponse);

// DELETE /api/responses/:id - Delete response (admin only)
router.delete('/:id', authenticateAdmin, deleteResponse);

export default router;

