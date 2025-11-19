import { 
  getFormConfigFromStorage, 
  saveFormConfigToStorage, 
  getDefaultFormConfig,
  getPrimaryFormFromStorage,
  getAllFormsFromStorage,
  getFormByIdFromStorage,
  createFormInStorage,
  updateFormInStorage,
  setFormAsPrimary,
  archiveFormInStorage,
  deleteFormFromStorage
} from '../services/storage.service.js';

// Get primary form (for home page)
export const getPrimaryForm = async (req, res) => {
  try {
    const config = await getPrimaryFormFromStorage();
    if (!config) {
      return res.status(404).json({ error: 'Primary form not found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Error getting primary form:', error);
    res.status(500).json({ error: 'Failed to get primary form' });
  }
};

// Get form config (backward compatibility - returns primary form)
export const getFormConfig = async (req, res) => {
  try {
    const config = await getFormConfigFromStorage();
    if (!config) {
      return res.status(404).json({ error: 'Form configuration not found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Error getting form config:', error);
    res.status(500).json({ error: 'Failed to get form configuration' });
  }
};

// Get all forms
export const getAllForms = async (req, res) => {
  try {
    const forms = await getAllFormsFromStorage();
    res.json(forms);
  } catch (error) {
    console.error('Error getting all forms:', error);
    res.status(500).json({ error: 'Failed to get forms' });
  }
};

// Get form by ID
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await getFormByIdFromStorage(id);
    if (!config) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Error getting form by ID:', error);
    res.status(500).json({ error: 'Failed to get form' });
  }
};

// Create new form
export const createForm = async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.title || !Array.isArray(formData.fields)) {
      return res.status(400).json({ error: 'Title and fields are required' });
    }

    const newForm = await createFormInStorage(formData);
    res.status(201).json({ message: 'Form created successfully', form: newForm });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: error.message || 'Failed to create form' });
  }
};

// Update form config
export const updateFormConfig = async (req, res) => {
  try {
    const config = req.body;
    
    // Validate required fields
    if (!config.id || !config.title || !Array.isArray(config.fields)) {
      return res.status(400).json({ error: 'Invalid form configuration' });
    }

    const updatedConfig = await saveFormConfigToStorage(config);
    res.json({ message: 'Form configuration updated successfully', config: updatedConfig });
  } catch (error) {
    console.error('Error updating form config:', error);
    res.status(500).json({ error: error.message || 'Failed to update form configuration' });
  }
};

// Update form by ID
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;
    
    // Validate required fields
    if (!formData.title || !Array.isArray(formData.fields)) {
      return res.status(400).json({ error: 'Title and fields are required' });
    }

    const updatedForm = await updateFormInStorage(id, formData);
    res.json({ message: 'Form updated successfully', form: updatedForm });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: error.message || 'Failed to update form' });
  }
};

// Set form as primary
export const setPrimaryForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedForm = await setFormAsPrimary(id);
    res.json({ message: 'Form set as primary successfully', form: updatedForm });
  } catch (error) {
    console.error('Error setting form as primary:', error);
    res.status(500).json({ error: error.message || 'Failed to set form as primary' });
  }
};

// Archive form
export const archiveForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;
    
    if (typeof isArchived !== 'boolean') {
      return res.status(400).json({ error: 'isArchived must be a boolean' });
    }

    // Only allow archiving (isArchived: true)
    // To unarchive, user must set form as primary instead
    if (!isArchived) {
      return res.status(400).json({ error: 'To unarchive a form, set it as primary instead' });
    }

    const updatedForm = await archiveFormInStorage(id, isArchived);
    res.json({ 
      message: 'Form archived successfully', 
      form: updatedForm 
    });
  } catch (error) {
    console.error('Error archiving form:', error);
    res.status(500).json({ error: error.message || 'Failed to archive form' });
  }
};

// Delete form
export const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFormFromStorage(id);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: error.message || 'Failed to delete form' });
  }
};

export const initializeFormConfig = async (req, res) => {
  try {
    const existing = await getFormConfigFromStorage();
    if (existing) {
      return res.json(existing);
    }

    const defaultConfig = getDefaultFormConfig();
    defaultConfig.isPrimary = true; // Set as primary by default
    const savedConfig = await saveFormConfigToStorage(defaultConfig);
    res.json(savedConfig);
  } catch (error) {
    console.error('Error initializing form config:', error);
    res.status(500).json({ error: 'Failed to initialize form configuration' });
  }
};

