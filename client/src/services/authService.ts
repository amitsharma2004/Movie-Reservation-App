import api from './api';
import type { LoginData, RegisterData, AuthResponse } from '../types/auth';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data);
    if (response.data.data.tokens?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/api/user/profile');
    return response.data;
  }
};