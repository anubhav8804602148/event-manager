import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as localStorage from '../utils/localStorage';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../utils/constants';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenType, setTokenType] = useState('Bearer');
  const [expiresIn, setExpiresIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedTokenType = localStorage.getItem('tokenType');
    const storedExpiresIn = localStorage.getItem('expiresIn');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUser(storedUser);
      if (storedTokenType) setTokenType(storedTokenType);
      if (storedExpiresIn) setExpiresIn(parseInt(storedExpiresIn));
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, accessToken, refreshTokenValue, tokenTypeValue = 'Bearer', expiresInValue) => {
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setTokenType(tokenTypeValue);
    if (expiresInValue) {
      setExpiresIn(expiresInValue);
    }
    
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
    localStorage.setItem(USER_KEY, userData);
    localStorage.setItem('tokenType', tokenTypeValue);
    if (expiresInValue) {
      localStorage.setItem('expiresIn', expiresInValue.toString());
    }
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setTokenType('Bearer');
    setExpiresIn(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('tokenType');
    localStorage.removeItem('expiresIn');
    setError(null);
  }, []);

  const register = useCallback(async (registerData) => {
    try {
      setLoading(true);
      const response = await authService.register(registerData);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, updatedUser);
  }, []);

  const value = {
    user,
    token,
    refreshToken,
    tokenType,
    expiresIn,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
