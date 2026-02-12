import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, LoginCredentials, RegisterData, AuthResponse, ProfileUpdateData } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
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
              address: data.data.user.address,
              city: data.data.user.city,
              state: data.data.user.state,
              phone: data.data.user.phone,
              zipCode: data.data.user.zipCode,
              country: data.data.user.country,
              isVerified: data.data.user.isVerified,
              createdAt: data.data.user.createdAt,
              updatedAt: data.data.user.updatedAt,
            };
            
            // Store tokens in localStorage
            if (data.data.tokens?.accessToken) {
              localStorage.setItem('accessToken', data.data.tokens.accessToken);
            }
            if (data.data.tokens?.refreshToken) {
              localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
            }
            
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
          formData.append('fullname', data.name);
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
          
          if (responseData.success && responseData.data?.user) {
            const user = {
              _id: responseData.data.user._id,
              name: responseData.data.user.fullname,
              email: responseData.data.user.email,
              avatar: responseData.data.user.avatar,
              role: responseData.data.user.role,
              address: responseData.data.user.address,
              city: responseData.data.user.city,
              state: responseData.data.user.state,
              phone: responseData.data.user.phone,
              zipCode: responseData.data.user.zipCode,
              country: responseData.data.user.country,
              isVerified: responseData.data.user.isVerified,
              createdAt: responseData.data.user.createdAt,
              updatedAt: responseData.data.user.updatedAt,
            };
            
            if (responseData.data.tokens?.accessToken) {
              localStorage.setItem('accessToken', responseData.data.tokens.accessToken);
            }
            if (responseData.data.tokens?.refreshToken) {
              localStorage.setItem('refreshToken', responseData.data.tokens.refreshToken);
            }
            
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
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },

      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile');
          const data = response.data as any;
          
          if (data.success && data.data?.user) {
            const user = {
              _id: data.data.user._id,
              name: data.data.user.fullname,
              email: data.data.user.email,
              avatar: data.data.user.avatar,
              role: data.data.user.role,
              address: data.data.user.address,
              city: data.data.user.city,
              state: data.data.user.state,
              phone: data.data.user.phone,
              zipCode: data.data.user.zipCode,
              country: data.data.user.country,
              isVerified: data.data.user.isVerified,
              createdAt: data.data.user.createdAt,
              updatedAt: data.data.user.updatedAt,
            };
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Get profile error:', error);
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: async (data: ProfileUpdateData) => {
        try {
          const response = await api.put('/auth/profile', data);
          const responseData = response.data as any;
          
          if (responseData.success && responseData.data?.user) {
            const user = {
              _id: responseData.data.user._id,
              name: responseData.data.user.fullname,
              email: responseData.data.user.email,
              avatar: responseData.data.user.avatar,
              role: responseData.data.user.role,
              address: responseData.data.user.address,
              city: responseData.data.user.city,
              state: responseData.data.user.state,
              phone: responseData.data.user.phone,
              zipCode: responseData.data.user.zipCode,
              country: responseData.data.user.country,
              isVerified: responseData.data.user.isVerified,
              createdAt: responseData.data.user.createdAt,
              updatedAt: responseData.data.user.updatedAt,
            };
            set({ user });
          }
        } catch (error: any) {
          console.error('Update profile error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
