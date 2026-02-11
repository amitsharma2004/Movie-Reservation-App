export interface Theater {
  _id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity: number;
  screens: number;
  amenities?: string[];
  isActive: boolean;
  threaterLogo: string;
  contactNumber?: string;
  email?: string;
  description?: string;
  parkingAvailable?: boolean;
  foodCourtAvailable?: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TheaterFormData {
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity: number;
  screens: number;
  amenities?: string[];
  isActive: boolean;
  threaterLogo: string;
  contactNumber?: string;
  email?: string;
  description?: string;
  parkingAvailable?: boolean;
  foodCourtAvailable?: boolean;
}

export interface TheaterResponse {
  success: boolean;
  message: string;
  data: {
    theater: Theater;
  };
}

export interface TheatersResponse {
  success: boolean;
  message: string;
  data: {
    theaters: Theater[];
    count: number;
  };
}