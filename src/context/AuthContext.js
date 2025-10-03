
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const result = response.data;
            if (result.success && result.token) {
                const token = result.token;
                await AsyncStorage.setItem('userToken', token);
                setUserToken(token);
                return result;
            } else {
                setErrorMsg('Login failed: Invalid response');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setErrorMsg(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, userName, email, mobile, password) => {

        setLoading(true);
        setErrorMsg(null);
        console.log(`Name: ${name} username: ${userName} mobile: ${mobile} email: ${email} password: ${password}`);

        try {
            const response = await axiosInstance.post('/auth/signup', {
                name: name,
                username: userName,
                email: email,
                mobile: mobile,
                password: password
            });
            const result = response.data;
            if (result.success) {
                // Alert.alert('Signup Successful', result.message);
                console.log(result.message);
                return result;
            } else {
                setErrorMsg(result.message || 'Signup failed');
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'Signup failed. Please try again.';
            setErrorMsg(msg);
            Alert.alert('Message', msg);
        } finally {

            setLoading(false);


        }
    };


    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
    };

    const loadToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
    };

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, login, logout, signup, loading, errorMsg }}>
            {children}
        </AuthContext.Provider>
    );
};
