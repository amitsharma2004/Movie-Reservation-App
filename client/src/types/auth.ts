export interface User {
  _id: string;
  fullname: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  zipCode: string;
  country: string;
  role: 'user' | 'admin';
  avatar?: string;
  isVerified?: boolean;
  subscription?: string;
  history?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  zipCode?: string;
  country?: string;
  avatar?: File;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    user: User;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}