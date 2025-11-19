// Use proxy in development, or direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3001/api');

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('adminToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running.`);
    }
    throw error;
  }
}

// Form API
export const formAPI = {
  // Get primary form (for home page)
  getPrimaryForm: async () => {
    try {
      return await apiCall('/form/primary');
    } catch (error: any) {
      // If 404, return null to trigger initialization
      if (error.message.includes('404') || error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  },
  // Get form config (backward compatibility)
  getConfig: async () => {
    try {
      return await apiCall('/form');
    } catch (error: any) {
      // If 404, return null to trigger initialization
      if (error.message.includes('404') || error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  },
  // Get all forms (admin only)
  getAllForms: () => apiCall('/form/all'),
  // Get form by ID (admin only)
  getFormById: (id: string) => apiCall(`/form/${id}`),
  // Create new form (admin only)
  createForm: (formData: any) => apiCall('/form/new', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
  // Update form config (backward compatibility)
  updateConfig: (config: any) => apiCall('/form', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),
  // Update form by ID (admin only)
  updateForm: (id: string, formData: any) => apiCall(`/form/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
  }),
  // Set form as primary (admin only)
  setPrimaryForm: (id: string) => apiCall(`/form/${id}/set-primary`, {
    method: 'PUT',
  }),
  // Archive form (admin only)
  archiveForm: (id: string, isArchived: boolean) => apiCall(`/form/${id}/archive`, {
    method: 'PUT',
    body: JSON.stringify({ isArchived }),
  }),
  // Delete form (admin only)
  deleteForm: (id: string) => apiCall(`/form/${id}`, {
    method: 'DELETE',
  }),
  initializeConfig: () => apiCall('/form/initialize', {
    method: 'POST',
  }),
};

// Response API
export const responseAPI = {
  getAll: () => apiCall('/responses'),
  getById: (id: string) => apiCall(`/responses/${id}`),
  create: (data: { formId: string; data: Record<string, any>; email?: string }) => 
    apiCall('/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiCall(`/responses/${id}`, {
    method: 'DELETE',
  }),
};

// Admin API
export const adminAPI = {
  login: (password: string) => 
    apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () => 
    apiCall('/admin/logout', {
      method: 'POST',
    }),
  verify: () => apiCall('/admin/verify'),
};

