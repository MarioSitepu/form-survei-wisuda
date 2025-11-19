const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Form API
export const formAPI = {
  getConfig: () => apiCall('/form'),
  updateConfig: (config: any) => apiCall('/form', {
    method: 'PUT',
    body: JSON.stringify(config),
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

