import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/api/auth/login', { email, password });
      
      if (!response.data?.token) {
        throw new Error('Invalid response from server');
      }

      const { token } = response.data;
      localStorage.setItem('token', token);

      // Decode token to get user data
      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      // Special handling for admin@example.com
      const isAdmin = email === 'admin@example.com';
      const user: User = {
        id: decoded.userId,
        email: email,
        role: isAdmin ? 'ADMIN' : 'USER',
        isBlocked: false
      };
      
      console.log('User logged in:', user);
      set({ user, error: null });
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign in';
      set({ error: errorMessage, user: null });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/api/auth/signup', { email, password });
      
      if (!response.data?.token) {
        throw new Error('Invalid response from server');
      }

      const { token } = response.data;
      localStorage.setItem('token', token);

      // Decode token to get user data
      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      // Special handling for admin@example.com
      const isAdmin = email === 'admin@example.com';
      const user: User = {
        id: decoded.userId,
        email: email,
        role: isAdmin ? 'ADMIN' : 'USER',
        isBlocked: false
      };
      
      set({ user, error: null });
    } catch (error: any) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign up';
      set({ error: errorMessage, user: null });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      localStorage.removeItem('token');
      set({ user: null, error: null });
    } catch (error: any) {
      set({ error: 'Failed to sign out' });
    }
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }

      // Decode token to get user data
      const decoded = decodeToken(token);
      if (!decoded) {
        localStorage.removeItem('token');
        set({ user: null, isLoading: false });
        return;
      }

      // Special handling for admin@example.com
      const email = decoded.email || '';
      const isAdmin = email === 'admin@example.com';
      
      const user: User = {
        id: decoded.userId,
        email: email,
        role: isAdmin ? 'ADMIN' : 'USER',
        isBlocked: false
      };
      
      console.log('Fetched user:', user);
      set({ user, error: null });
    } catch (error: any) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('token');
      set({ user: null, error: 'Failed to fetch user data' });
    } finally {
      set({ isLoading: false });
    }
  }
}));