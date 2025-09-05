import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, isAuthenticated } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setAuthToken(token);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('AuthContext - Sending login request:', credentials);
      const response = await authAPI.login(credentials);
      console.log('AuthContext - Login response:', response);
      const { token, user: userData } = response.data;
      
      setAuthToken(token);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      console.error('AuthContext - Login error:', err);
      console.error('AuthContext - Error response:', err.response);
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('AuthContext - Sending registration request:', userData);
      const response = await authAPI.register(userData);
      console.log('AuthContext - Registration response:', response);
      const { token, user: newUser } = response.data;
      
      setAuthToken(token);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (err) {
      console.error('AuthContext - Registration error:', err);
      console.error('AuthContext - Error response:', err.response);
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
