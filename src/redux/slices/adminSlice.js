import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import {Alert} from 'react-native';
// import { Alert } from 'react-native';

// ========== THUNKS ==========

// 1. Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/dashboard');
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// 2. User Investments
export const fetchUserInvestments = createAsyncThunk(
  'admin/fetchUserInvestments',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/admin/userinvestments');
      // alert("INVESTMENT DATA: " + JSON.stringify(res.data)); // Dev only
      return res.data.investments;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// 3. CRUD for Investment Plans
export const createInvestmentPlan = createAsyncThunk(
  'admin/createInvestmentPlan',
  async (payload, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/admin/investment/plan', payload);
      return res.data.plan;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const fetchAllInvestmentPlans = createAsyncThunk(
  'admin/fetchAllInvestmentPlans',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/investment/plans');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateInvestmentPlan = createAsyncThunk(
  'admin/updateInvestmentPlan',
  async ({id, data}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put(
        `/admin/investment/updateplan/${id}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteInvestmentPlan = createAsyncThunk(
  'admin/deleteInvestmentPlan',
  async (id, {rejectWithValue}) => {
    try {
      await axiosInstance.delete(`/admin/deleteplan/${id}`);
      return {id};
    } catch (error) {
      const errorMsg =
        error?.response?.data || error.message || 'Unknown error';
      console.error('❌ Delete API failed:', errorMsg);
      return rejectWithValue(errorMsg);
    }
  },
);

// 4. Users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchUserById = createAsyncThunk(
  'admin/fetchUserById',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`/admin/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async ({id, status}, {rejectWithValue}) => {
    console.log(`Toggling user ${id} to status: ${status}`);
    try {
      const response = await axiosInstance.put(`/admin/user/${id}/status`, {
        status,
      });

      Alert.alert("Info", response.data.message);
      console.log('🔵 User status toggled:', response.data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || 'Status toggle failed');
    }
  },
);

// 5. Deposits / Withdrawals
export const fetchAllDeposits = createAsyncThunk(
  'admin/fetchAllDeposits',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/wallet/deposits');
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAllWithdrawals = createAsyncThunk(
  'admin/fetchAllWithdrawals',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/wallet/withdrawals');
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// In adminSlice.js
export const approveWithdrawal = createAsyncThunk(
  'admin/approveWithdrawal',
  async ({id, status}, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/admin/withdrawalstatus/${id}`,
        {status},
      );
      return response.data.transaction; // ✅ match what toggleWithdrawalStatus returns
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Approval failed';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const toggleDepositStatus = createAsyncThunk(
  'admin/toggleDepositStatus',
  async ({id, status}, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/depositstatus/${id}`, {
        status,
      });

      // Metro console me raw response
      console.log('🔵 Full backend response:', res.data);

      // Poora data return kar do taaki screen me alert kar sake
      return res.data;
    } catch (err) {
      console.log('🔴 Error:', err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const toggleWithdrawalStatus = createAsyncThunk(
  'admin/toggleWithdrawalStatus',
  async ({id, status}, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/withdrawalstatus/${id}`, {
        status,
      });
      return res.data.transaction;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

// 6. Others
export const fetchTransactionReports = createAsyncThunk(
  'admin/fetchTransactionReports',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/transactions');
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchSpinLogs = createAsyncThunk(
  'admin/fetchSpinLogs',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/spins/logs');
      return response.data.spins;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchReferralStats = createAsyncThunk(
  'admin/fetchReferralStats',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/admin/referrals');
      return response.data.referrals;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// ========== SLICE ==========

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardStats: null,
    users: [],
    singleUser: null,
    singleUserLoading: false,
    investmentPlans: [],
    userInvestments: [],
    deposits: [],
    withdrawals: [],
    spins: [],
    referralStats: [],
    transactionReports: [],
    loading: false,
    error: null,
    selectedPlan: null,
    selectedPlanMode: 'edit',
  },
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload.plan;
      state.selectedPlanMode = action.payload.mode;
    },
    clearSelectedPlan: state => {
      state.selectedPlan = null;
      state.selectedPlanMode = 'edit';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUserById.pending, state => {
        state.singleUserLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.singleUser = action.payload;
        state.singleUserLoading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.singleUserLoading = false;
        state.error = action.payload;
      })
      // .addCase(toggleUserStatus.fulfilled, (state, action) => {
      //   state.singleUser = action.payload;
      // })
     .addCase(toggleUserStatus.fulfilled, (state, action) => {
  const updatedUser = action.payload;
  state.singleUser = updatedUser;
  state.users = state.users.map(user =>
    user._id === updatedUser._id ? updatedUser : user,
  );
})

      .addCase(fetchAllInvestmentPlans.fulfilled, (state, action) => {
        state.investmentPlans = action.payload;
      })
      .addCase(fetchUserInvestments.fulfilled, (state, action) => {
        state.userInvestments = action.payload;
      })
      .addCase(fetchAllDeposits.fulfilled, (state, action) => {
        state.deposits = action.payload;
      })
      .addCase(fetchAllWithdrawals.fulfilled, (state, action) => {
        state.withdrawals = action.payload;
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.withdrawals.findIndex(w => w._id === updated._id);
        if (index !== -1) {
          state.withdrawals[index] = updated; // update entire object
        }
      })
      .addCase(fetchSpinLogs.fulfilled, (state, action) => {
        state.spins = action.payload;
      })
      .addCase(fetchReferralStats.fulfilled, (state, action) => {
        state.referralStats = action.payload;
      })
      .addCase(fetchTransactionReports.fulfilled, (state, action) => {
        state.transactionReports = action.payload;
      })
      .addCase(createInvestmentPlan.fulfilled, (state, action) => {
        const plan = action.payload;
        if (plan.amount && !plan.minAmount) {
          plan.minAmount = plan.amount;
        }
        state.investmentPlans.push(plan);
      })
      .addCase(updateInvestmentPlan.fulfilled, (state, action) => {
        const updatedPlan = action.payload;
        const index = state.investmentPlans.findIndex(
          plan => plan.id === updatedPlan.id,
        );
        if (index !== -1) {
          state.investmentPlans[index] = updatedPlan;
        }
      })
      .addCase(deleteInvestmentPlan.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.investmentPlans = state.investmentPlans.filter(
          plan => plan.id !== deletedId,
        );
      })
      .addCase(deleteInvestmentPlan.rejected, (state, action) => {
        const errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : action.payload?.message ||
              'Unknown error occurred while deleting the plan.';
        // Alert.alert('❌ Delete Failed', errorMessage); // ⚠️ Can't use Alert outside component
        console.error('❌ Delete Failed:', errorMessage);
      })
      .addCase(toggleDepositStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.deposits.findIndex(
          item => item._id === updated._id,
        );
        if (index !== -1) {
          state.deposits[index] = updated;
        }
      })
      .addCase(toggleWithdrawalStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.withdrawals.findIndex(
          item => item._id === updated._id,
        );
        if (index !== -1) {
          state.withdrawals[index] = updated;
        }
      })
      .addMatcher(
        action =>
          action.type.startsWith('admin/') && action.type.endsWith('/pending'),
        state => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        action =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/fulfilled'),
        state => {
          state.loading = false;
          state.error = null;
        },
      )
      .addMatcher(
        action =>
          action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  }, // ✅ closes extraReducers
}); // ✅ closes createSlice

// ✅ export actions and reducer
export const {setSelectedPlan, clearSelectedPlan} = adminSlice.actions;
export default adminSlice.reducer;
