import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { Alert } from 'react-native';
// import { Alert } from 'react-native';
// Fetch plans

export const fetchInvestmentPlans = createAsyncThunk(
  'investment/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/invest/plans');

      // ✅ Debug alert — shows raw plan data as string
      // Alert.alert('Plans', JSON.stringify(res.data.plans, null, 2));

      return res.data.plans;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

// Subscribe to plan
export const subscribeToPlan = createAsyncThunk(
    'investment/subscribe',
    async ({ id, payload }, { rejectWithValue, getState, dispatch }) => {
        try {
            // const token = getState().auth.userToken;
            // console.log('Subscribing to plan with ID:', id, 'and payload:', payload);
            await dispatch(fetchActiveInvestments());
            const res = await axiosInstance.post(`/invest/subscribe/${id}`, payload);

            // console.log('Subscription Response:', res.data);
            return res.data.investment;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Subscription failed');
        }

    }
);

// Fetch active investments
export const fetchActiveInvestments = createAsyncThunk(
  'investment/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/invest/my-active'); // ✅ FIXED
      return res.data.investments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active investments');
    }
  }
);

// Fetch investment history


export const fetchInvestmentHistory = createAsyncThunk(
  'investment/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/invest/my-history'); 
       console.log("past", res.data.investments);
      return res.data.investments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch investment history');
    }
  }
);



const investmentSlice = createSlice({
    name: 'investment',
    initialState: {
        plans: [],
        activeInvestments: [],
        investmentHistory: [],
        loading: false,
        error: null,
        investPlanLoading: false,

    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Plans
            .addCase(fetchInvestmentPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvestmentPlans.fulfilled, (state, action) => {
                state.plans = action.payload;
                state.loading = false;
            })
            .addCase(fetchInvestmentPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Subscribe
            .addCase(subscribeToPlan.pending, (state) => {
                state.investPlanLoading = true;
            })
            .addCase(subscribeToPlan.fulfilled, (state, action) => {
                state.investPlanLoading = false;
            })
            .addCase(subscribeToPlan.rejected, (state, action) => {
                state.investPlanLoading = false;
                state.error = action.payload;
            })

            // Active Investments
            .addCase(fetchActiveInvestments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActiveInvestments.fulfilled, (state, action) => {
                state.activeInvestments = action.payload;
                state.loading = false;
            })
            .addCase(fetchActiveInvestments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Investment History
            .addCase(fetchInvestmentHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvestmentHistory.fulfilled, (state, action) => {
                state.investmentHistory = action.payload;
                state.loading = false;
            })
            .addCase(fetchInvestmentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default investmentSlice.reducer;