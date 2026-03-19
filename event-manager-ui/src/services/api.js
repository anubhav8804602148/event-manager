import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants';
import * as localStorage from '../utils/localStorage';

// Create Axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and unwrap response
api.interceptors.response.use(
  (response) => {
    // Unwrap the API response wrapper
    // Backend wraps response in { success, message, data, error, statusCode }
    // We want to return response.data as the new response.data so axios consumers get what they expect
    if (response.data && response.data.data !== undefined) {
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
