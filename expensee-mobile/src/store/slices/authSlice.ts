import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface User {
  user_id: string;
  email: string;
  full_name: string | null;
  status: 'active' | 'inactive' | 'suspended';
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initialCheckDone: boolean; // Added to track initial authentication check
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true, // Start with loading state true
  error: null,
  isAuthenticated: false,
  initialCheckDone: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{user: User; token: string; refreshToken: string}>,
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.initialCheckDone = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.initialCheckDone = true;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.initialCheckDone = true;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{token: string; refreshToken: string}>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    // New action to indicate auth check is complete (even if no login)
    authCheckComplete: (
      state,
      action: PayloadAction<{isAuthenticated: boolean}>,
    ) => {
      state.isLoading = false;
      state.initialCheckDone = true;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  refreshTokenSuccess,
  authCheckComplete,
} = authSlice.actions;

export default authSlice.reducer;
