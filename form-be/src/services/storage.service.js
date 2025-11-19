import FormConfig from '../models/FormConfig.model.js';
import Response from '../models/Response.model.js';

// Form Config Storage
export const getFormConfigFromStorage = async () => {
  try {
    let config = await FormConfig.findOne({ id: 'default-form' });
    
    if (!config) {
      // Create default config if it doesn't exist
      config = await FormConfig.create(getDefaultFormConfig());
    }
    
    return config.toObject();
  } catch (error) {
    console.error('Error getting form config:', error);
    throw error;
  }
};

export const saveFormConfigToStorage = async (configData) => {
  try {
    const config = await FormConfig.findOneAndUpdate(
      { id: configData.id || 'default-form' },
      {
        ...configData,
        updatedAt: Date.now()
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    return config.toObject();
  } catch (error) {
    console.error('Error saving form config:', error);
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
export const getResponsesFromStorage = async () => {
  try {
    const responses = await Response.find({}).sort({ submittedAt: -1 });
    return responses.map(r => ({
      id: r._id.toString(),
      formId: r.formId,
      data: r.data,
      email: r.email,
      submittedAt: r.submittedAt
    }));
  } catch (error) {
    console.error('Error getting responses:', error);
    throw error;
  }
};

export const addResponseToStorage = async (responseData) => {
  try {
    const response = await Response.create({
      formId: responseData.formId,
      data: responseData.data,
      email: responseData.email || null,
      submittedAt: Date.now()
    });
    
    return {
      id: response._id.toString(),
      formId: response.formId,
      data: response.data,
      email: response.email,
      submittedAt: response.submittedAt
    };
  } catch (error) {
    console.error('Error adding response:', error);
    throw error;
  }
};

export const getResponseByIdFromStorage = async (id) => {
  try {
    const response = await Response.findById(id);
    if (!response) return null;
    
    return {
      id: response._id.toString(),
      formId: response.formId,
      data: response.data,
      email: response.email,
      submittedAt: response.submittedAt
    };
  } catch (error) {
    console.error('Error getting response by ID:', error);
    throw error;
  }
};

export const deleteResponseFromStorage = async (id) => {
  try {
    const result = await Response.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting response:', error);
    throw error;
  }
};
