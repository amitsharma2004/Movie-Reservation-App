export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  zipCode?: string;
  country?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}


export interface ProfileUpdateData {
  fullname?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  zipCode?: string;
  country?: string;
}
