import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { User } from '@/src/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth on mount
    setIsInitialized(true);
  }, []);

  const value: AuthContextType = {
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login: async (email: string, password: string) => {
      await auth.login({ email, password });
    },
    register: async (email: string, password: string, confirmPassword: string, name: string) => {
      await auth.register({ email, password, confirmPassword, name });
    },
    logout: auth.logout,
    requestPasswordReset: async (email: string) => {
      await auth.requestPasswordReset({ email });
    },
    resetPassword: async (token: string, password: string, confirmPassword: string) => {
      await auth.resetPassword({ token, password, confirmPassword });
    },
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
