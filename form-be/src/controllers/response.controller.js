import { 
  getResponsesFromStorage, 
  addResponseToStorage, 
  getResponseByIdFromStorage,
  deleteResponseFromStorage 
} from '../services/storage.service.js';

export const getResponses = async (req, res) => {
  try {
    const responses = await getResponsesFromStorage();
    res.json(responses);
  } catch (error) {
    console.error('Error getting responses:', error);
    res.status(500).json({ error: 'Failed to get responses' });
  }
};

export const getResponseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getResponseByIdFromStorage(id);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error getting response:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
};

export const addResponse = async (req, res) => {
  try {
    const { formId, data, email } = req.body;

    if (!formId || !data) {
      return res.status(400).json({ error: 'formId and data are required' });
    }

    const newResponse = await addResponseToStorage({
      formId,
      data,
      email: email || null,
    });

    res.status(201).json({ 
      message: 'Response submitted successfully', 
      response: newResponse 
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteResponseFromStorage(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
};

