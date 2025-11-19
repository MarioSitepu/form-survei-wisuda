import { 
  getResponsesFromStorage, 
  addResponseToStorage, 
  getResponseByIdFromStorage,
  deleteResponseFromStorage 
} from '../services/storage.service.js';

export const getResponses = (req, res) => {
  try {
    const responses = getResponsesFromStorage();
    res.json(responses);
  } catch (error) {
    console.error('Error getting responses:', error);
    res.status(500).json({ error: 'Failed to get responses' });
  }
};

export const getResponseById = (req, res) => {
  try {
    const { id } = req.params;
    const response = getResponseByIdFromStorage(id);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error getting response:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
};

export const addResponse = (req, res) => {
  try {
    const { formId, data, email } = req.body;

    if (!formId || !data) {
      return res.status(400).json({ error: 'formId and data are required' });
    }

    const newResponse = {
      id: Date.now().toString(),
      formId,
      data,
      email: email || null,
      submittedAt: Date.now(),
    };

    addResponseToStorage(newResponse);
    res.status(201).json({ 
      message: 'Response submitted successfully', 
      response: newResponse 
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

export const deleteResponse = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteResponseFromStorage(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
};

