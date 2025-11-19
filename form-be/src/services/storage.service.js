import FormConfig from '../models/FormConfig.model.js';
import Response from '../models/Response.model.js';

// Form Config Storage
export const getFormConfigFromStorage = async () => {
  try {
    // Get primary form, or default-form if no primary exists
    let config = await FormConfig.findOne({ isPrimary: true, isArchived: false });
    
    if (!config) {
      // Fallback to default-form
      config = await FormConfig.findOne({ id: 'default-form' });
    }
    
    if (!config) {
      // Create default config if it doesn't exist
      const defaultConfig = getDefaultFormConfig();
      defaultConfig.isPrimary = true; // Set as primary by default
      config = await FormConfig.create(defaultConfig);
    }
    
    return config.toObject();
  } catch (error) {
    console.error('Error getting form config:', error);
    throw error;
  }
};

// Get primary form (for home page)
export const getPrimaryFormFromStorage = async () => {
  try {
    const config = await FormConfig.findOne({ isPrimary: true, isArchived: false });
    if (!config) {
      return null;
    }
    return config.toObject();
  } catch (error) {
    console.error('Error getting primary form:', error);
    throw error;
  }
};

// Get all forms
export const getAllFormsFromStorage = async () => {
  try {
    const forms = await FormConfig.find({}).sort({ createdAt: -1 });
    return forms.map(form => form.toObject());
  } catch (error) {
    console.error('Error getting all forms:', error);
    throw error;
  }
};

// Get form by ID
export const getFormByIdFromStorage = async (formId) => {
  try {
    const config = await FormConfig.findOne({ id: formId });
    if (!config) return null;
    return config.toObject();
  } catch (error) {
    console.error('Error getting form by ID:', error);
    throw error;
  }
};

// Create new form
export const createFormInStorage = async (formData) => {
  try {
    // Generate unique ID if not provided
    if (!formData.id) {
      formData.id = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Ensure only one primary form exists
    if (formData.isPrimary) {
      await FormConfig.updateMany({}, { isPrimary: false });
    }
    
    const config = await FormConfig.create({
      ...formData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    return config.toObject();
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

// Set form as primary (ensures only one is primary)
export const setFormAsPrimary = async (formId) => {
  try {
    // First, unset all other primary forms
    await FormConfig.updateMany({}, { isPrimary: false });
    
    // Set this form as primary
    const config = await FormConfig.findOneAndUpdate(
      { id: formId },
      { 
        isPrimary: true,
        isArchived: false, // Can't be archived if primary
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!config) {
      throw new Error('Form not found');
    }
    
    return config.toObject();
  } catch (error) {
    console.error('Error setting form as primary:', error);
    throw error;
  }
};

// Archive/unarchive form
export const archiveFormInStorage = async (formId, isArchived) => {
  try {
    const config = await FormConfig.findOne({ id: formId });
    if (!config) {
      throw new Error('Form not found');
    }
    
    // Can't archive primary form
    if (config.isPrimary && isArchived) {
      throw new Error('Cannot archive primary form. Set another form as primary first.');
    }
    
    const updated = await FormConfig.findOneAndUpdate(
      { id: formId },
      { 
        isArchived: isArchived,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    return updated.toObject();
  } catch (error) {
    console.error('Error archiving form:', error);
    throw error;
  }
};

export const saveFormConfigToStorage = async (configData) => {
  try {
    // If setting as primary, unset all other primary forms
    if (configData.isPrimary) {
      await FormConfig.updateMany(
        { id: { $ne: configData.id || 'default-form' } },
        { isPrimary: false }
      );
    }
    
    // Can't archive primary form
    if (configData.isPrimary && configData.isArchived) {
      configData.isArchived = false;
    }
    
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

// Update form by ID
export const updateFormInStorage = async (formId, formData) => {
  try {
    // If setting as primary, unset all other primary forms
    if (formData.isPrimary) {
      await FormConfig.updateMany(
        { id: { $ne: formId } },
        { isPrimary: false }
      );
    }
    
    // Can't archive primary form
    if (formData.isPrimary && formData.isArchived) {
      formData.isArchived = false;
    }
    
    const config = await FormConfig.findOneAndUpdate(
      { id: formId },
      {
        ...formData,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!config) {
      throw new Error('Form not found');
    }
    
    return config.toObject();
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

// Delete form
export const deleteFormFromStorage = async (formId) => {
  try {
    const config = await FormConfig.findOne({ id: formId });
    if (!config) {
      throw new Error('Form not found');
    }
    
    // Can't delete primary form
    if (config.isPrimary) {
      throw new Error('Cannot delete primary form. Set another form as primary first.');
    }
    
    await FormConfig.deleteOne({ id: formId });
    return true;
  } catch (error) {
    console.error('Error deleting form:', error);
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
    isPrimary: true,
    isArchived: false,
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
