import { create } from 'zustand';
import { authApi } from '@/lib/api';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  checkAuth: async () => {
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  login: async (email: string, password: string) => {
    const user = await authApi.login({ email, password });
    set({ user, isAuthenticated: true });
  },
  
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    const user = await authApi.register({ email, password, firstName, lastName });
    set({ user, isAuthenticated: true });
  },
  
  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
