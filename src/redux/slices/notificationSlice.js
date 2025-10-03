import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
// Get notifications
export const getAllNotifications = createAsyncThunk(
    'notification/getNotification', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/notification/notification')
            return response.data.notifications
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification');
        }
    }
);
// delete notifications
export const deleteAllNotifications = createAsyncThunk(
    'notification/deleteNotification', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/notification/deleteAll')
            return response.data.message
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        loading: false,
        errorMsg: null,
        successMsg: null,
    },
    extraReducers: (builder) => {
        builder
            // getNotifications
            .addCase(getAllNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;

            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.errorMsg = action.error.message;
            })
            // deleteAll Notification
            .addCase(deleteAllNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.successMsg = action.payload;

            })
            .addCase(deleteAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.errorMsg = action.error.message;
            })


    }
});
export default notificationSlice.reducer;