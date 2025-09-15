import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: true,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: '1',
            name: 'John Doe',
            email,
            phone: '+91 9876543210',
            address: 'Mumbai, Maharashtra',
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            isAuthenticated: true,
            user: mockUser,
            isLoading: false,
            error: null,
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      signup: async (userData: Omit<User, 'id'>) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Replace with actual API call
          const newUser: User = {
            id: Date.now().toString(),
            ...userData,
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            isAuthenticated: true,
            user: newUser,
            isLoading: false,
            error: null,
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // TODO: Call logout API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still logout locally even if API fails
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthState: async () => {
        try {
          set({ isLoading: true });
          
          // Check if user is already authenticated
          const { isAuthenticated, user } = get();
          if (isAuthenticated && user) {
            set({ isLoading: false });
            return;
          }
          
          // TODO: Validate token with backend
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'oneqlick-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
