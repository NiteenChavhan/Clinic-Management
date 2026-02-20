// API base URL
export const API_BASE_URL = 'http://localhost:5001/api';

// Set up default headers
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// API request wrapper with auth token
export const authenticatedRequest = (config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};