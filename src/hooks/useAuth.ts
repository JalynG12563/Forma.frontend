import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { secureStorage } from '@/src/utils/secureStorage';
import { authService } from '@/src/services/authService';
import api from '@/src/config/api';
import { LoginCredentials, RegisterCredentials, PasswordResetRequest, PasswordReset } from '@/src/types/auth';

export const useAuth = () => {
  const { token, user, isLoading, error, setToken, setUser, setIsLoading, setError, logout } = useAuthStore();

  // Load token from secure storage on app start
  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true);
      try {
        const savedToken = await secureStorage.getToken();
        if (savedToken) {
          setToken(savedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

          // Load user data
          const userData = await secureStorage.getUserData();
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error loading token:', error);
        setError('Failed to load authentication');
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, [setToken, setUser, setIsLoading, setError]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { token: newToken, user: userData } = response;

      await secureStorage.setToken(newToken);
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      await secureStorage.setUserData(JSON.stringify(userData));
      setUser(userData);

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setIsLoading, setError]);

  // Register
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(credentials);
      const { token: newToken, user: userData } = response;

      await secureStorage.setToken(newToken);
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      await secureStorage.setUserData(JSON.stringify(userData));
      setUser(userData);

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setIsLoading, setError]);

  // Request password reset
  const requestPasswordReset = useCallback(async (data: PasswordResetRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.requestPasswordReset(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset request failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  // Reset password
  const resetPassword = useCallback(async (data: PasswordReset) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  // Logout
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
      await secureStorage.clearAll();
      logout();
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server fails
      await secureStorage.clearAll();
      logout();
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  }, [logout, setIsLoading, setError]);

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    requestPasswordReset,
    resetPassword,
    logout: handleLogout,
  };
};
