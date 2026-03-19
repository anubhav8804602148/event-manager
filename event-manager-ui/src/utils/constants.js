// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8003/api';

// User Roles
export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN'
};

// Event Status
export const EVENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  DELETED: 'DELETED'
};

// Registration Status
export const REGISTRATION_STATUS = {
  REGISTERED: 'REGISTERED',
  ATTENDED: 'ATTENDED',
  CANCELLED: 'CANCELLED',
  REMOVED: 'REMOVED'
};

// Event Categories
export const EVENT_CATEGORIES = [
  'Workshop',
  'Seminar',
  'Sports',
  'Cultural',
  'Tech Talk',
  'Networking',
  'Conference',
  'Other'
];

// Color Palette
export const COLORS = {
  primary: '#0066CC',
  secondary: '#00A896',
  success: '#28A745',
  warning: '#FF9800',
  danger: '#DC3545',
  bgLight: '#F5F5F5',
  bgDark: '#1F1F1F',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#CCCCCC'
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// Token Keys
export const TOKEN_KEY = 'authToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = 'MMM DD, YYYY HH:mm';
