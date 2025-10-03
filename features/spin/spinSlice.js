import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
// play spin
export const playSpin = createAsyncThunk(
    'spin/playSpin', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/spin/play')
            // console.log('Response', response.data);
            return response.data

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to play spin');
        }
    }
);
// purchase spin
export const purchaseSpin = createAsyncThunk(
    'spin/purchaseSpin', async (spinQuantity, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/spin/purchase', {
                spinCount: spinQuantity
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to purchase spin');
        }
    }
);
// play spin
export const getSpinLogs = createAsyncThunk(
    'spin/spinLogs', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/spin/logs')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load spin logs');
        }
    }
);
// spin prizes
export const getSpinPrizeList = createAsyncThunk(
    'spin/spinPrizeList', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/spin/prizelist')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load spin prize list');
        }
    }
);
// get spinCount
export const getSpinCount = createAsyncThunk(
    'spin/getSpinCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/spin/count');
            console.log('Spin count', response.data.spinCount);
            return response.data.spinCount;


        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch spin count');
        }
    }
);
const spinSlice = createSlice({
    name: 'spin',
    initialState: {
        spinHistory: [],
        errorMsg: null,
        successMsg: null,
        spinResult: null,
        updatedSpinCount: 0,
        remainingBalance: 0,
        prizeList: [],
        spinCount: 0,
        playSpinLoading: null,
        purchaseLoading: null,
        spinCountLoading: null,
        spinLogsLoading: null,
        prizeListLoading: null,


    },
    reducers: {
        clearSpinError: (state) => {
            state.errorMsg = null;
        },
        clearSpinResult: (state) => {
            state.spinResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // playSpin
            .addCase(playSpin.pending, (state) => {
                state.playSpinLoading = true
            })
            .addCase(playSpin.fulfilled, (state, action) => {
                state.playSpinLoading = false;
                state.spinResult = action.payload;
                state.spinCount = action.payload.spinCount;

            })
            .addCase(playSpin.rejected, (state, action) => {
                state.playSpinLoading = false;
                state.errorMsg = action.payload;
            })
            // purchase spin
            .addCase(purchaseSpin.pending, (state) => {
                state.purchaseLoading = true
            })
            .addCase(purchaseSpin.fulfilled, (state, action) => {
                state.purchaseLoading = false;
                state.updatedSpinCount = action.payload.updatedSpinCount;
                state.remainingBalance = action.payload.remainingBalance;

            })
            .addCase(purchaseSpin.rejected, (state, action) => {
                state.purchaseLoading = false;
                state.errorMsg = action.error.message;
            })
            // get spin logs
            .addCase(getSpinLogs.pending, (state) => {
                state.spinLogsLoading = true
            })
            .addCase(getSpinLogs.fulfilled, (state, action) => {
                state.spinLogsLoading = false;
                state.spinHistory = action.payload;

            })
            .addCase(getSpinLogs.rejected, (state, action) => {
                state.spinLogsLoading = false;
                state.errorMsg = action.payload;
            })
            // prize list
            .addCase(getSpinPrizeList.pending, (state) => {
                state.prizeListLoading = true
            })
            .addCase(getSpinPrizeList.fulfilled, (state, action) => {
                state.prizeListLoading = false;
                state.prizeList = action.payload;

            })
            .addCase(getSpinPrizeList.rejected, (state, action) => {
                state.prizeListLoading = false;
                state.errorMsg = action.payload;
            })
            // get spin count
            .addCase(getSpinCount.pending, (state) => {
                state.spinCountLoading = true
            })
            .addCase(getSpinCount.fulfilled, (state, action) => {
                state.spinCountLoading = false;
                state.spinCount = action.payload;
            })
            .addCase(getSpinCount.rejected, (state, action) => {
                state.spinCountLoading = false;
                state.errorMsg = action.payload;
            })


    }
});
export const { clearSpinError, clearSpinResult } = spinSlice.actions;
export default spinSlice.reducer;