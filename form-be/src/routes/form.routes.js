import express from 'express';
import { 
  getFormConfig, 
  updateFormConfig, 
  initializeFormConfig,
  getPrimaryForm,
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  setPrimaryForm,
  archiveForm,
  deleteForm
} from '../controllers/form.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
// GET /api/form/primary - Get primary form (for home page)
router.get('/primary', getPrimaryForm);

// GET /api/form - Get form configuration (backward compatibility - returns primary)
router.get('/', getFormConfig);

// POST /api/form/initialize - Initialize default form config
router.post('/initialize', initializeFormConfig);

// Admin routes (require authentication)
// GET /api/form/all - Get all forms
router.get('/all', authenticateAdmin, getAllForms);

// GET /api/form/:id - Get form by ID
router.get('/:id', authenticateAdmin, getFormById);

// POST /api/form/new - Create new form
router.post('/new', authenticateAdmin, createForm);

// PUT /api/form - Update form configuration (backward compatibility)
router.put('/', authenticateAdmin, updateFormConfig);

// PUT /api/form/:id - Update form by ID
router.put('/:id', authenticateAdmin, updateForm);

// PUT /api/form/:id/set-primary - Set form as primary
router.put('/:id/set-primary', authenticateAdmin, setPrimaryForm);

// PUT /api/form/:id/archive - Archive form
router.put('/:id/archive', authenticateAdmin, archiveForm);

// DELETE /api/form/:id - Delete form
router.delete('/:id', authenticateAdmin, deleteForm);

export default router;

