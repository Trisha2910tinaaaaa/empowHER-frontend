import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get the authentication token
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Register a new user
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      withCredentials: true
    });
    
    // If backend sends a token, save it to localStorage for frontend use
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true
    });
    
    // If backend sends a token, save it to localStorage for frontend use
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout a user
 */
export const logout = async () => {
  try {
    // Clear token from localStorage first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // Then call backend to clear the cookie
    const response = await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    // Even if the backend call fails, ensure we clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    throw error;
  }
};

/**
 * Get the current logged in user
 */
export const getCurrentUser = async () => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('auth_token');
    
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgotpassword`, { email }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (resetToken: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resetpassword/${resetToken}`, { password }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Helper function to create auth headers with token
export const getAuthHeaders = () => {
  const token = getToken();
  
  if (!token) {
    console.warn('No auth token found');
  }
  
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    withCredentials: true,
  };
}; 