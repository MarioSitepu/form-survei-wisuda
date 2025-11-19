import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const FORM_CONFIG_FILE = path.join(DATA_DIR, 'form-config.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Form Config Storage
export const getFormConfigFromStorage = () => {
  try {
    const data = fs.readFileSync(FORM_CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

export const saveFormConfigToStorage = (config) => {
  try {
    fs.writeFileSync(FORM_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
};

export const getDefaultFormConfig = () => {
  return {
    id: 'default-form',
    title: 'Customer Feedback Form',
    description: 'Please share your feedback with us',
    fields: [
      {
        id: 'name',
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
      },
      {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'you@example.com',
      },
      {
        id: 'feedback',
        name: 'feedback',
        label: 'Your Feedback',
        type: 'textarea',
        required: true,
        placeholder: 'Tell us what you think...',
      },
      {
        id: 'rating',
        name: 'rating',
        label: 'Overall Rating',
        type: 'select',
        required: true,
        options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Poor', '1 - Very Poor'],
      },
      {
        id: 'subscribe',
        name: 'subscribe',
        label: 'Subscribe to our newsletter',
        type: 'checkbox',
        required: false,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

// Responses Storage
export const getResponsesFromStorage = () => {
  try {
    const data = fs.readFileSync(RESPONSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

export const addResponseToStorage = (response) => {
  try {
    const responses = getResponsesFromStorage();
    responses.push(response);
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2), 'utf-8');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getResponseByIdFromStorage = (id) => {
  try {
    const responses = getResponsesFromStorage();
    return responses.find(r => r.id === id) || null;
  } catch (error) {
    throw error;
  }
};

export const deleteResponseFromStorage = (id) => {
  try {
    const responses = getResponsesFromStorage();
    const index = responses.findIndex(r => r.id === id);
    
    if (index === -1) {
      return false;
    }
    
    responses.splice(index, 1);
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2), 'utf-8');
    return true;
  } catch (error) {
    throw error;
  }
};

