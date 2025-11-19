import { getFormConfigFromStorage, saveFormConfigToStorage, getDefaultFormConfig } from '../services/storage.service.js';

export const getFormConfig = (req, res) => {
  try {
    const config = getFormConfigFromStorage();
    res.json(config);
  } catch (error) {
    console.error('Error getting form config:', error);
    res.status(500).json({ error: 'Failed to get form configuration' });
  }
};

export const updateFormConfig = (req, res) => {
  try {
    const config = req.body;
    
    // Validate required fields
    if (!config.id || !config.title || !Array.isArray(config.fields)) {
      return res.status(400).json({ error: 'Invalid form configuration' });
    }

    const updatedConfig = {
      ...config,
      updatedAt: Date.now(),
    };

    saveFormConfigToStorage(updatedConfig);
    res.json({ message: 'Form configuration updated successfully', config: updatedConfig });
  } catch (error) {
    console.error('Error updating form config:', error);
    res.status(500).json({ error: 'Failed to update form configuration' });
  }
};

export const initializeFormConfig = (req, res) => {
  try {
    const existing = getFormConfigFromStorage();
    if (existing) {
      return res.json(existing);
    }

    const defaultConfig = getDefaultFormConfig();
    saveFormConfigToStorage(defaultConfig);
    res.json(defaultConfig);
  } catch (error) {
    console.error('Error initializing form config:', error);
    res.status(500).json({ error: 'Failed to initialize form configuration' });
  }
};

