import { adminAPI } from '@/services/api';

export const ADMIN_PASSWORD = 'admin123'; // Default, should be from backend

export const setAdminSession = async (password: string): Promise<string> => {
  try {
    const result = await adminAPI.login(password);
    if (result.token) {
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminSessionExpiry', (Date.now() + 86400000).toString()); // 24 hours
      return result.token;
    }
    throw new Error('No token received');
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const getAdminSession = (): string | null => {
  const token = localStorage.getItem('adminToken');
  const expiry = localStorage.getItem('adminSessionExpiry');
  
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry)) {
    clearAdminSession();
    return null;
  }
  
  return token;
};

export const clearAdminSession = async (): Promise<void> => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminSessionExpiry');
};

export const verifyAdminSession = async (): Promise<boolean> => {
  try {
    await adminAPI.verify();
    return true;
  } catch (error) {
    clearAdminSession();
    return false;
  }
};
