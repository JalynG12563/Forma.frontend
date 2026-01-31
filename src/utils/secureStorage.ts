import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const secureStorage = {
  // Token management
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },

  // User data management
  async setUserData(data: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, data);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<string | null> {
    try {
      const data = await SecureStore.getItemAsync(USER_KEY);
      return data;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
      throw error;
    }
  },

  // Clear all stored data
  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUserData();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
