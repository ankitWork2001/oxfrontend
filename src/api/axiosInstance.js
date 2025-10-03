import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = 'https://api.oxfamofficial.com/api';
// export const API_BASE_URL = 'http://192.168.29.20:3000/api';
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token in every request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
