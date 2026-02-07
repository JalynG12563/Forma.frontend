import api from '@/src/config/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, PasswordResetRequest, PasswordReset } from '@/src/types/auth';

export const authService = {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { confirmPassword, ...payload } = credentials;
      const response = await api.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      throw new Error(errorMessage);
    }
  },

  // Reset password with token
  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    try {
      const { confirmPassword, ...payload } = data;
      const response = await api.post<{ message: string }>('/auth/reset-password', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      throw new Error(errorMessage);
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token refresh failed';
      throw new Error(errorMessage);
    }
  },

  // Logout (optional - server-side cleanup)
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Don't throw - local logout should still proceed
    }
  },

  // Verify token
  async verifyToken(token: string): Promise<{ valid: boolean }> {
    try {
      const response = await api.post<{ valid: boolean }>('/auth/verify', { token });
      return response.data;
    } catch (error: any) {
      return { valid: false };
    }
  },
};
