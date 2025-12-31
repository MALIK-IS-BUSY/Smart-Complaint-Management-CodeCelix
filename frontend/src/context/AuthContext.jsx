import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');

    if (token) {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { data } = response.data;
      localStorage.removeItem('admin');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setAdmin(null);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { data } = response.data;
      localStorage.removeItem('admin');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setAdmin(null);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const response = await authAPI.adminLogin({ username, password });
      const { data } = response.data;
      localStorage.removeItem('user');
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data));
      setUser(null);
      setAdmin(data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Admin login failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        register,
        adminLogin,
        logout,
        isAuthenticated: !!user || !!admin,
        isAdmin: !!admin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

