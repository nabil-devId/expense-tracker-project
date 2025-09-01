import axios from 'axios';
import {API, STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../store';
import {logout} from '../store/slices/authSlice';

// Create a logger utility
const logger = {
  request: config => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params,
      timestamp: new Date().toISOString(),
    });
  },
  response: response => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - response.config.metadata.startTime}ms`,
    });
  },
  error: error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
      duration: error.config?.metadata?.startTime
        ? `${Date.now() - error.config.metadata.startTime}ms`
        : 'unknown',
    });
  },
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token and logging
apiClient.interceptors.request.use(
  async config => {
    // Add timestamp metadata for duration calculation
    config.metadata = {startTime: Date.now()};

    // Add auth token
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request
    logger.request(config);

    return config;
  },
  error => {
    // Log request error
    logger.error(error);
    return Promise.reject(error);
  },
);

// Custom error class for authentication errors
export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Function to handle logout and clear storage
const handleLogout = async () => {
  console.log('🔑 Logging out user due to authentication failure');

  // Clear auth data from storage
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);

  // Dispatch logout action to Redux store
  // This will trigger navigation to login screen via RootNavigator
  store.dispatch(logout());
};

// Response interceptor for handling token expiration and logging
apiClient.interceptors.response.use(
  response => {
    // Log successful response
    logger.response(response);
    return response;
  },
  async error => {
    // Log the error
    logger.error(error);

    const originalRequest = error.config;
    const status = error.response?.status;

    // If error is 401 Unauthorized and retry flag not set
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');

        // Get refresh token from storage
        const refreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN,
        );

        if (!refreshToken) {
          console.log('❌ No refresh token available');
          // No refresh token available, force logout and navigate to login
          await handleLogout();
          return Promise.reject(
            new AuthenticationError('No refresh token available'),
          );
        }

        // Call refresh token endpoint
        const refreshResponse = await apiClient.post(
          API.ENDPOINTS.AUTH.REFRESH,
          {
            request: {
              refresh_token: refreshToken,
            },
            user_agent: 'ExpenseeApp',
          },
        );

        console.log('✅ Token refresh successful');

        // Update tokens in storage
        const {access_token, refresh_token} = refreshResponse.data;
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

        // Update auth header and retry request
        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        console.log('🔄 Retrying original request');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('❌ Token refresh failed', refreshError);

        // Refresh token failed, force logout and navigate to login
        await handleLogout();
        return Promise.reject(new AuthenticationError('Token refresh failed'));
      }
    }

    // Handle other authentication-related errors
    if (status === 403) {
      console.log(
        '⛔ Access forbidden - forcing logout and redirecting to login',
      );
      // Force logout for forbidden access
      await handleLogout();
      return Promise.reject(new AuthenticationError('Access forbidden'));
    }

    // If we get a clear indication that tokens are invalid/expired/revoked
    if (
      (status === 401 && originalRequest._retry) || // Already tried refresh and still getting 401
      error.response?.data?.error === 'invalid_token' ||
      error.response?.data?.error === 'token_expired' ||
      error.response?.data?.error === 'token_revoked' ||
      error.response?.data?.message?.toLowerCase().includes('token') ||
      error.response?.data?.message?.toLowerCase().includes('auth')
    ) {
      console.log('🔒 Authentication error detected, logging out user');
      await handleLogout();
      return Promise.reject(new AuthenticationError('Authentication failed'));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
