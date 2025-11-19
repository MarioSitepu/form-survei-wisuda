import { getFormConfigFromStorage, saveFormConfigToStorage, getDefaultFormConfig } from '../services/storage.service.js';

export const getFormConfig = async (req, res) => {
  try {
    const config = await getFormConfigFromStorage();
    res.json(config);
  } catch (error) {
    console.error('Error getting form config:', error);
    res.status(500).json({ error: 'Failed to get form configuration' });
  }
};

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
    res.status(500).json({ error: 'Failed to update form configuration' });
  }
};

export const initializeFormConfig = async (req, res) => {
  try {
    const existing = await getFormConfigFromStorage();
    if (existing) {
      return res.json(existing);
    }

    const defaultConfig = getDefaultFormConfig();
    const savedConfig = await saveFormConfigToStorage(defaultConfig);
    res.json(savedConfig);
  } catch (error) {
    console.error('Error initializing form config:', error);
    res.status(500).json({ error: 'Failed to initialize form configuration' });
  }
};

