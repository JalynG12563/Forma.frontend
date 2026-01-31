import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,
  setToken: (token: string) => set({ token, isAuthenticated: !!token }),
  setUser: (user: any) => set({ user }),
  logout: () => set({ token: null, isAuthenticated: false, user: null }),
}));
