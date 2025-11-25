import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

// Mock user data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  email: 'alex@tech.co',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'user',
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string) => {
    // Simulate login
    set({ 
      user: { ...MOCK_USER, email }, 
      isAuthenticated: true 
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
