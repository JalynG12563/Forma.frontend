import { create } from 'zustand';
import { User } from '@/src/types/auth';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  
  setToken: (token: string) => set({ token, isAuthenticated: !!token }),
  setUser: (user: User) => set({ user }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  
  logout: () => set({
    token: null,
    isAuthenticated: false,
    user: null,
    error: null,
  }),
  
  reset: () => set({
    token: null,
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  }),
}));
