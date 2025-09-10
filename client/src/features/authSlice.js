import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting registration process:', { email: userData.email });
      console.log('📡 API URL:', API_URL);
      
      console.log('🚀 Sending registration request...');
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000, // 10 second timeout
        validateStatus: false // Don't throw on non-2xx responses
      });
      
      console.log('📨 Server response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      if (response.status !== 200) {
        console.error('❌ Registration failed:', response.data);
        return rejectWithValue(response.data.msg || 'Registration failed');
      }

      console.log('✅ Registration successful!');
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('💥 Registration error:', {
        name: error.name,
        message: error.message,
        config: error.config,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      
      return rejectWithValue(
        error.response?.data?.msg || 
        error.message || 
        'An unexpected error occurred'
      );
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('🔑 Attempting login:', { email: userData.email });
      const response = await axios.post(`${API_URL}/auth/login`, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000, // 10 second timeout
        validateStatus: false // Don't throw on non-2xx responses
      });

      if (response.status !== 200) {
        return rejectWithValue(response.data.msg || 'Login failed');
      }

      if (response.data?.token) {
        console.log('✅ Login successful, storing token');
        localStorage.setItem('token', response.data.token);
        // Parse the token to get user info
        const base64Url = response.data.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        response.data.user = payload.user;
      }
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      
      return rejectWithValue(
        error.response?.data?.msg || 
        error.message || 
        'An unexpected error occurred'
      );
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.get(`${API_URL}/auth/me`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
