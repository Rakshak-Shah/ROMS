'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiBaseUrl } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff' | 'delivery';
  isActive: boolean;
  isVerified: boolean;
  addresses?: Array<{
    id: string;
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    deliveryAddress?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // API helper function
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${getApiBaseUrl()}/api${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Try to parse JSON, fallback to empty object
    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {
      // ignore
    }

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return responseData;
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 'success') {
        // Backend returns user and token at top level, not nested in data
        const { user: userData, token: authToken } = response;
        
        if (userData && authToken) {
          // Map id to _id if needed
          const mappedUser = {
            ...userData,
            _id: userData.id || userData._id
          };
          
          setUser(mappedUser);
          setToken(authToken);
          
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(mappedUser));
          
          return mappedUser;
        } else {
          throw new Error('Missing user or token in response');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<User> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.status === 'success') {
        // Backend returns user and token at top level, not nested in data
        const { user: newUser, token: authToken } = response;
        
        if (newUser && authToken) {
          // Map id to _id if needed
          const mappedUser = {
            ...newUser,
            _id: newUser.id || newUser._id
          };
          
          setUser(mappedUser);
          setToken(authToken);
          
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(mappedUser));
          
          return mappedUser;
        } else {
          throw new Error('Missing user or token in response');
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};