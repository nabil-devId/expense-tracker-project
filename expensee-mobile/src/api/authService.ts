import apiClient from './client';
import {API} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post(
      API.ENDPOINTS.AUTH.LOGIN,
      {
        username: data.username,
        password: data.password,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // Store tokens
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUTH_TOKEN,
      response.data.access_token,
    );
    if (response.data.refresh_token) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refresh_token,
      );
    }

    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(API.ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  logout: async () => {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (refreshToken) {
      try {
        await apiClient.post(API.ENDPOINTS.AUTH.LOGOUT, {token: refreshToken});
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Remove all auth-related data regardless of API response
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post(
      API.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post(
      API.ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post(API.ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    // Update stored tokens
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUTH_TOKEN,
      response.data.access_token,
    );
    if (response.data.refresh_token) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refresh_token,
      );
    }

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get(API.ENDPOINTS.USER.ME);
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(response.data),
    );
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get(API.ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  updateUserProfile: async (data: any) => {
    const response = await apiClient.patch(API.ENDPOINTS.USER.PROFILE, data);
    return response.data;
  },
};

export default authService;
