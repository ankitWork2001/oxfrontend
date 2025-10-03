import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';
import jwtDecode from 'jwt-decode';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const result = response.data;

            if (result.success && result.token) {
                const token = result.token;
                await AsyncStorage.setItem('userToken', token);
                return token;
            } else {
                return rejectWithValue(result.message || 'Login failed');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed. Please try again.');
        }
    }
);

// Async thunk for signup
export const signup = createAsyncThunk(
    'auth/signup',
    async ({ name, username, email, mobile, password, referralCode }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/signup', {
                name,
                username,
                email,
                mobile,
                password,
                referralCode,
            });
            const result = response.data;
            if (result.success) {
                return result.message;
            } else {
                return rejectWithValue(result.message || 'Signup failed');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed. Please try again.');
        }
    }
);

// Async thunk for loading token from storage
export const loadToken = createAsyncThunk(
    'auth/loadToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (err) {
            return rejectWithValue('No token found');
        }
    }
);

// Async thunk for logout
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await AsyncStorage.removeItem('userToken');
        return null;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userToken: null,
        userId: null,
        loading: false,
        errorMsg: null,
    },
    reducers: {
        logout: (state) => {
            state.userToken = null;
            state.userId = null;
            AsyncStorage.removeItem('userToken');
        },
        loadUserFromStorage: (state, action) => {
            state.userToken = action.payload.token;
            state.userInfo = action.payload.user;
        },
        // ✅ NEW reducer added here
        setUserToken: (state, action) => {
            state.userToken = action.payload;
            state.userId = action.payload ? jwtDecode(action.payload).id : null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.errorMsg = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.userToken = action.payload;
                state.userId = jwtDecode(action.payload).id;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.errorMsg = action.payload;
            })

            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.errorMsg = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.errorMsg = action.payload;
            })

            // Load token
            .addCase(loadToken.pending, (state) => {
                state.loading = true;
                state.errorMsg = null;
            })
            .addCase(loadToken.fulfilled, (state, action) => {
                state.userToken = action.payload;
                state.userId = action.payload ? jwtDecode(action.payload).id : null;
                state.loading = false;
            })
            .addCase(loadToken.rejected, (state, action) => {
                state.userToken = null;
                state.userId = null;
                state.loading = false;
                state.errorMsg = action.payload;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.userToken = null;
            });
    },
});

// ✅ Add `setUserToken` in export
export const { logout: logoutAction, loadUserFromStorage, setUserToken } = authSlice.actions;

export default authSlice.reducer;