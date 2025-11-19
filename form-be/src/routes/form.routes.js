import express from 'express';
import { getFormConfig, updateFormConfig, initializeFormConfig } from '../controllers/form.controller.js';

const router = express.Router();

// GET /api/form - Get form configuration
router.get('/', getFormConfig);

// PUT /api/form - Update form configuration
router.put('/', updateFormConfig);

// POST /api/form/initialize - Initialize default form config
router.post('/initialize', initializeFormConfig);

export default router;

