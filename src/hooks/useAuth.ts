import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { secureStorage } from '@/src/utils/secureStorage';
import api from '@/src/config/api';

export const useAuth = () => {
  const { token, user, setToken, setUser, logout } = useAuthStore();

  // Load token from secure storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await secureStorage.getToken();
        if (savedToken) {
          setToken(savedToken);
          // Add token to API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };

    loadToken();
  }, [setToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      if (newToken) {
        await secureStorage.setToken(newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }

      if (userData) {
        await secureStorage.setUserData(JSON.stringify(userData));
        setUser(userData);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      const { token: newToken, user: userData } = response.data;

      if (newToken) {
        await secureStorage.setToken(newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }

      if (userData) {
        await secureStorage.setUserData(JSON.stringify(userData));
        setUser(userData);
      }

      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await secureStorage.clearAll();
      logout();
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    signup,
    logout: handleLogout,
  };
};
