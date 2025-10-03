import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { Alert } from 'react-native';

// ✅ Verify UPI ID (Send OTP)

export const verifyUpiId = createAsyncThunk(
  'wallet/verifyUpiId',
  async ({ upiId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/upiVerification/verify-upid', { upiId });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyUpiIdOtp = createAsyncThunk(
  'wallet/verifyUpiIdOtp',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/upiVerification/verify-upid/otp', { otp });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const verifyBinanceAddress = createAsyncThunk(
  'wallet/verifyBinanceAddress',
  async ({ address }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/addressVerify/verify-address', { address });
      // console.log('Binance Address Response:', res.data);
      // return res.data.message;
      return res.data; // ✅ full object { message, verifiedAddress }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyBinanceOtp = createAsyncThunk(
  'wallet/verifyBinanceOtp',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/addressVerify/verify-otp', { otp });
      return res.data; // ✅ poora object return karo { message, verifiedAddress }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);





// ✅ Get Wallet Balance
export const getWalletBalance = createAsyncThunk(
  'wallet/getBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wallet/balance');
      return response.data.wallet;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
    }
  }
);

// ✅ Deposit Funds
export const depositFunds = createAsyncThunk(
  'wallet/deposit',
  async ({ amount, walletAddress, date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wallet/deposit', {
        amount,
        walletAddress,
        date,
        method: 'Binance', // ✅ Hardcoded as per your request
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Deposit failed');
    }
  }
);

// ✅ Withdraw Funds
export const withdrawFunds = createAsyncThunk(
  'wallet/withdraw',
  async ({ amount, walletAddress, date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wallet/withdrawal', {
        amount,
        walletAddress,
        date,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Withdraw failed');
    }
  }
);


// ✅ Get Transactions
export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wallet/transactions');
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// ✅ Wallet Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null,
    loading: false,
    errorMsg: null,
    successMsg: null,
    transactions: [],
  },
  reducers: {
    clearWalletMessages: (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wallet Balance
      .addCase(getWalletBalance.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })

      // Deposit Funds
      .addCase(depositFunds.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })

      // Withdraw Funds
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.successMsg = action.payload;
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.errorMsg = action.payload;
      })

      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })

      // Verify UPI ID (Send OTP)
      .addCase(verifyUpiId.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(verifyUpiId.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(verifyUpiId.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      })

      // Verify OTP for UPI
      .addCase(verifyUpiIdOtp.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(verifyUpiIdOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(verifyUpiIdOtp.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { clearWalletMessages } = walletSlice.actions;
export default walletSlice.reducer;
