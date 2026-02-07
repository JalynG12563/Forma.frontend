import axios, { AxiosInstance, AxiosError } from 'axios';
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

// Track if we're currently refreshing token to avoid duplicate requests
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Token will be added by auth context
    // This allows the auth hook to set the Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401) {
      // Unauthorized - could be invalid token or expired
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(
              `${config.baseURL}/auth/refresh`,
              { refreshToken }
            );

            const { token: newToken } = response.data;
            localStorage.setItem('auth_token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            processQueue(null, newToken);

            // Retry original request
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          processQueue(err, null);
          // Clear auth and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
        // Queue the request while token is being refreshed
        return new Promise<any>((resolve, reject) => {
          failedQueue.push({ resolve: () => resolve(null), reject });
        }).then(() => {
          originalRequest.headers['Authorization'] =
            `Bearer ${localStorage.getItem('auth_token')}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }
    }

    // Handle specific error messages
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return Promise.reject({
        status: error.response.status,
        message: errorData.message || 'An error occurred',
        code: errorData.code || 'UNKNOWN_ERROR',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
