import api from './api';

export const authService = {
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  changePassword: (passwordData) => {
    return api.post('/auth/change-password', passwordData);
  }
};
