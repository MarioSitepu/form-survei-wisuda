import { formAPI, responseAPI } from '@/services/api';

export type FormField = {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type FormConfig = {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: number;
  updatedAt: number;
};

export type FormResponse = {
  id: string;
  formId: string;
  data: Record<string, any>;
  email?: string;
  submittedAt: number;
};

// Initialize default form config
export const initializeFormConfig = async (): Promise<FormConfig> => {
  try {
    // Try to get existing config
    const config = await formAPI.getConfig();
    if (config && config.fields && config.fields.length > 0) {
      return config;
    }
    
    // If no config exists or config is empty, initialize default
    try {
      const defaultConfig = await formAPI.initializeConfig();
      return defaultConfig;
    } catch (initError: any) {
      console.error('Error initializing default config:', initError);
      // If initialization fails, return fallback config
      return getDefaultFormConfig();
    }
  } catch (error: any) {
    console.error('Error loading form config:', error);
    // If API fails completely, try to initialize default
    try {
      const defaultConfig = await formAPI.initializeConfig();
      return defaultConfig;
    } catch (initError: any) {
      // Last resort: return fallback config
      console.warn('Using fallback form config');
      return getDefaultFormConfig();
    }
  }
};

// Get default form config (fallback)
const getDefaultFormConfig = (): FormConfig => {
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

// Get all responses
export const getFormResponses = async (): Promise<FormResponse[]> => {
  try {
    return await responseAPI.getAll();
  } catch (error) {
    console.error('Error getting responses:', error);
    return [];
  }
};

// Add a new response
export const addFormResponse = async (response: Omit<FormResponse, 'id' | 'submittedAt'>): Promise<FormResponse> => {
  try {
    const result = await responseAPI.create(response);
    return result.response;
  } catch (error) {
    console.error('Error adding response:', error);
    throw error;
  }
};

// Update form config
export const updateFormConfig = async (config: FormConfig): Promise<void> => {
  try {
    await formAPI.updateConfig(config);
  } catch (error) {
    console.error('Error updating form config:', error);
    throw error;
  }
};
