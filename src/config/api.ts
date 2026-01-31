import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

// Environment configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
  },
  staging: {
    baseURL: 'https://staging-api.formaapp.com/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://api.formaapp.com/api',
    timeout: 10000,
  },
};

// Get current environment
const ENV = __DEV__ ? 'development' : 'production';
const config = API_CONFIG[ENV as keyof typeof API_CONFIG];

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Token will be added by auth context
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      console.log('Unauthorized - logging out');
    }
    return Promise.reject(error);
  }
);

export default api;
