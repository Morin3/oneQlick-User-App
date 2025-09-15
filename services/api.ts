// API Service Layer for oneQlick User App
import { ApiResponse, PaginatedResponse, Restaurant, FoodItem, Order, User } from '../types';

// Environment configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.oneqlick.com/v1';

// API Configuration
const API_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Request interceptor for adding auth token
const getAuthHeaders = async () => {
  const token = await getStoredToken();
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Token management
const getStoredToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      timeout: API_CONFIG.timeout,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Request failed',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      statusCode: 0,
    };
  }
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Restaurant API
export const restaurantAPI = {
  getRestaurants: async (params?: {
    latitude?: number;
    longitude?: number;
    cuisine?: string;
    isVeg?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/restaurants?${queryParams.toString()}`);
  },

  getRestaurant: async (id: string): Promise<ApiResponse<Restaurant>> => {
    return apiRequest(`/restaurants/${id}`);
  },

  getRestaurantMenu: async (id: string): Promise<ApiResponse<FoodItem[]>> => {
    return apiRequest(`/restaurants/${id}/menu`);
  },

  searchRestaurants: async (query: string, filters?: any): Promise<ApiResponse<Restaurant[]>> => {
    return apiRequest('/restaurants/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  },
};

// Food Items API
export const foodAPI = {
  getFoodItems: async (params?: {
    restaurantId?: string;
    category?: string;
    isVeg?: boolean;
    isPopular?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<FoodItem>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/food-items?${queryParams.toString()}`);
  },

  getFoodItem: async (id: string): Promise<ApiResponse<FoodItem>> => {
    return apiRequest(`/food-items/${id}`);
  },

  searchFoodItems: async (query: string): Promise<ApiResponse<FoodItem[]>> => {
    return apiRequest(`/food-items/search?q=${encodeURIComponent(query)}`);
  },
};

// Orders API
export const orderAPI = {
  createOrder: async (orderData: {
    restaurantId: string;
    items: Array<{
      foodItemId: string;
      quantity: number;
      customization?: Record<string, string>;
      addOns?: string[];
    }>;
    deliveryAddress: string;
    paymentMethod: string;
    specialInstructions?: string;
  }): Promise<ApiResponse<Order>> => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/orders?${queryParams.toString()}`);
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}`);
  },

  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  trackOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}/track`);
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest('/user/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getAddresses: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest('/user/addresses');
  },

  addAddress: async (addressData: any): Promise<ApiResponse<any>> => {
    return apiRequest('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id: string, addressData: any): Promise<ApiResponse<any>> => {
    return apiRequest(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/user/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export const apiUtils = {
  isNetworkError: (error: any): boolean => {
    return error?.statusCode === 0 || error?.message?.includes('Network');
  },

  isAuthError: (error: any): boolean => {
    return error?.statusCode === 401 || error?.statusCode === 403;
  },

  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.error) return error.error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },
};

export default {
  auth: authAPI,
  restaurant: restaurantAPI,
  food: foodAPI,
  order: orderAPI,
  user: userAPI,
  utils: apiUtils,
};
