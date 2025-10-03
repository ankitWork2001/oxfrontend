import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
// import { Alert } from 'react-native';

export interface BonusItem {
  name: string;
  date: string;
  amount: number;
  level: number;
}

interface RewardSummary {
  totalReferrals: number;
  earnings: number;
  activeInvestors: number;
}

interface RewardState {
  rewardBalance: number;
  spinBalance: number;
  referralBalance: number;
  summary: RewardSummary;
  bonusHistory: BonusItem[];
  loading: boolean;
  error: string | null;
}

export const fetchRewardInfo = createAsyncThunk<any, void, { rejectValue: string }>(
  'reward/fetchRewardInfo',
  async (_, { rejectWithValue }) => {
    try {
      const [walletRes, summaryRes] = await Promise.all([
        axiosInstance.get('/reward/getreward'),
        axiosInstance.get('/referral/summary'),
      ]);

      // Debug log
      console.log("Reward API Response:", walletRes.data);
      console.log("Summary API Response:", summaryRes.data);
      // Alert.alert(
      //   "API Summary Response",
      //   JSON.stringify(summaryRes.data, null, 2)
      // );


      return {
        ...walletRes.data,
        summary: summaryRes.data?.data, // this should contain totalReferrals, earnings, activeInvestors
      };
    } catch (error: any) {
      let message = 'Failed to fetch reward info';
      if (error.response) {
        message = error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const withdrawRewardBalance = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>(
  "reward/withdrawRewardBalance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/reward/withdrawRewardBalance");
      return res.data;
    } catch (error: any) {
      let message = "Failed to withdraw reward balance";
      if (error.response) {
        message =
          error.response.data?.message ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);


const initialState: RewardState = {
  rewardBalance: 0,
  spinBalance: 0,
  referralBalance: 0,
  summary: {
    totalReferrals: 0,
    earnings: 0,
    activeInvestors: 0,
  },
  bonusHistory: [],
  loading: false,
  error: null,
};

const rewardSlice = createSlice({
  name: 'reward',
  initialState,
  reducers: {
    resetRewardState: (state) => {
      state.rewardBalance = 0;
      state.spinBalance = 0;
      state.referralBalance = 0;
      state.summary = {
        totalReferrals: 0,
        earnings: 0,
        activeInvestors: 0,
      };
      state.bonusHistory = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewardInfo.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload;

        const rawSummary = data.summary ?? {};
        const referrals = rawSummary.referrals ?? [];

        // ✅ Manually extract fields
        const earnings = rawSummary.totalCommission ?? 0;
        const activeInvestors = referrals.filter((r: any) => r.isCommissionGiven).length;

        const summary = {
          totalReferrals: rawSummary.totalReferrals ?? 0,
          earnings,
          activeInvestors
        };

        // Show alert if needed
        // Alert.alert(
        //   'Summary (from frontend)',
        //   `Referrals: ${summary.totalReferrals}\nEarnings: ${summary.earnings}\nActive: ${summary.activeInvestors}`
        // );

        state.loading = false;
        state.rewardBalance = data.rewardBalance ?? 0;
        state.spinBalance = data.spineBalance ?? 0;
        state.referralBalance = data.referralBalance ?? 0;
        state.summary = summary;

        state.bonusHistory = data.bonusHistory?.length > 0 ? data.bonusHistory : [
          { name: 'Rohit Sharma', date: new Date().toISOString(), amount: 25, level: 1 },
          { name: 'Kunal Verma', date: new Date().toISOString(), amount: 40, level: 1 },
          { name: 'Shruti Mehta', date: new Date().toISOString(), amount: 30, level: 1 },
        ];
      })

      .addCase(fetchRewardInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch reward info';
      });


      builder
  .addCase(withdrawRewardBalance.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(withdrawRewardBalance.fulfilled, (state, action) => {
    state.loading = false;
    // After withdrawal, reset reward balance
    state.rewardBalance = 0;
  })
  .addCase(withdrawRewardBalance.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload ?? "Withdrawal failed";
  });
  },
  
});



export const { resetRewardState } = rewardSlice.actions;
export default rewardSlice.reducer;
