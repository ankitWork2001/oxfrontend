import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { Alert } from 'react-native';

export const fetchReferralCode = createAsyncThunk(
  'referral/fetchReferralCode',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/referral/code-link');


      // ✅ Alert for success
      // Alert.alert('Referral Code Fetched', JSON.stringify(res.data.code, null, 2));

      return res.data.code;
    } catch (error) {
      let message = 'Failed to fetch referral code';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }

      // ❌ Alert for error
      Alert.alert('Fetch Referral Error', message);

      return rejectWithValue(message);
    }
  }
);


export const fetchReferralTree = createAsyncThunk(
  'referral/fetchReferralTree',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/referral/tree');
      return res.data.tree || [];
    } catch (error) {
      let message = 'Failed to fetch referral tree';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchReferralCommission = createAsyncThunk(
  'referral/fetchReferralCommission',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/referral/commission');
      return res.data.commission || 0;
    } catch (error) {
      let message = 'Failed to fetch commission';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchReferralSummary = createAsyncThunk(
  'referral/fetchReferralSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/referral/summary');
      return res.data;
    } catch (error) {
      let message = 'Failed to fetch referral summary';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchSubReferrals = createAsyncThunk(
  'referral/fetchSubReferrals',
  async (directReferralId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `referral/getSubReferralsByDirectReferral/${directReferralId}`
      );
      const allSubReferrals = res.data.subReferrals || [];
      return allSubReferrals;
    } catch (error) {
      let message = 'Failed to fetch referral tree';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);



// Initial State
const initialState = {
  referralCode: null,
  referralTree: [],
  commission: 0,
  allSubReferrals: [],
  summary: {
    totalReferrals: 0,
    earnings: 0,
    activeInvestors: 0,
    referrals: [],
  },
  referralLoading: false,
  errorMsg: null,
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    resetReferralState: (state) => {
      state.referralCode = null;
      state.referralTree = [];
      state.commission = 0;
      state.allSubReferrals = [];
      state.summary = {
        totalReferrals: 0,
        earnings: 0,
        activeInvestors: 0,
        referrals: [],
      };
      state.referralLoading = false;
      state.errorMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralCode.fulfilled, (state, action) => {
        state.referralCode = action.payload;
      })
      .addCase(fetchReferralTree.fulfilled, (state, action) => {
        state.referralTree = action.payload;
      })

      .addCase(fetchSubReferrals.fulfilled, (state, action) => {
  state.allSubReferrals = action.payload;
})
      .addCase(fetchReferralCommission.fulfilled, (state, action) => {
        state.commission = action.payload;
      })
      .addCase(fetchReferralSummary.pending, (state) => {
        state.referralLoading = true;
        state.errorMsg = null;
      })
      .addCase(fetchReferralSummary.fulfilled, (state, action) => {
        const data = action.payload?.data;

        // Debug alert here
        // Alert.alert('Referral Summary Response', JSON.stringify(data, null, 2));
1

        state.referralLoading = false;
        state.summary = {
          totalReferrals: data.totalReferrals || 0,
          earnings: data.earnings || 0,
          activeInvestors: data.activeInvestors || 0,
          referrals: data.referrals || [],
        };
      })

      .addCase(fetchReferralSummary.rejected, (state, action) => {
        state.referralLoading = false;
        state.errorMsg = action.payload;

        // ✅ Alert to show the error
        // Alert.alert('Referral Summary Error', String(action.payload));
      });
  },
});

export const { resetReferralState } = referralSlice.actions;
export default referralSlice.reducer;

