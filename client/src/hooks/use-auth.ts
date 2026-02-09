import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const data = response.data as any;
          
          // Handle backend response format
          if (data.success && data.data?.user) {
            const user = {
              _id: data.data.user._id,
              name: data.data.user.fullname,
              email: data.data.user.email,
              avatar: data.data.user.avatar,
              role: data.data.user.role,
            };
            set({ user, isAuthenticated: true });
            return { success: true, message: data.message, user };
          }
          return { success: false, message: data.message || 'Login failed' };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          throw { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('fullname', data.name); // Backend expects 'fullname'
          formData.append('email', data.email);
          formData.append('password', data.password);
          if (data.avatar) {
            formData.append('avatar', data.avatar);
          }

          const response = await api.post<AuthResponse>('/auth/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const responseData = response.data as any;
          
          // Handle backend response format
          if (responseData.success && responseData.data?.user) {
            const user = {
              _id: responseData.data.user._id,
              name: responseData.data.user.fullname,
              email: responseData.data.user.email,
              avatar: responseData.data.user.avatar,
              role: responseData.data.user.role,
            };
            set({ user, isAuthenticated: true });
            return { success: true, message: responseData.message, user };
          }
          return { success: false, message: responseData.message || 'Registration failed' };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          throw { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          const response = await api.get<{ user: User }>('/auth/me');
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
