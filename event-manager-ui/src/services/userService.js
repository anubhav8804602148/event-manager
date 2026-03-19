import api from './api';

export const userService = {
  // Get current user profile
  getProfile: () => {
    return api.get('/users/profile');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },

  // Change password
  changePassword: (currentPassword, newPassword) => {
    return api.post('/users/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Get all users (admin only)
  getAllUsers: (page = 0, size = 10, params = {}) => {
    return api.get('/users', {
      params: {
        page,
        size,
        ...params
      }
    });
  },

  // Get user by ID (admin only)
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Enable/Disable user account (admin only)
  toggleUserStatus: (id, enabled) => {
    return api.put(`/users/${id}/status`, { enabled });
  },

  // Search users (admin only)
  searchUsers: (keyword, page = 0, size = 10) => {
    return api.get('/users/search', {
      params: { keyword, page, size }
    });
  }
};
