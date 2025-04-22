"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login, register, logout } from '../api/auth';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getToken: () => null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Set up axios interceptor to handle authentication
const setupAxiosInterceptors = () => {
  // Request interceptor for API calls
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for API calls
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If the error is due to an expired token (401 Unauthorized)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token or redirect to login
          localStorage.removeItem('auth_token');
          
          // Clear user data
          window.dispatchEvent(new Event('auth:logout'));
          
          // If we're not already on the auth page, redirect
          if (window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
        } catch (refreshError) {
          console.error('Token refresh failed', refreshError);
          // Redirect to login
          window.location.href = '/auth';
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up axios interceptors
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.log('No token found in localStorage, user is not authenticated');
          setLoading(false);
          return;
        }
        
        console.log('Token found, attempting to get current user');
        const data = await getCurrentUser();
        
        if (data && data.user) {
          console.log('User data received successfully');
          setUser(data.user);
          setError(null);
        } else {
          console.error('Invalid user data received:', data);
          setUser(null);
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Get token
  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  // Login user
  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await login({ email, password });
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      setUser(data.user);
      
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const registerUser = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await register({ name, email, password });
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      setUser(data.user);
      
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      setLoading(true);
      await logout();
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 