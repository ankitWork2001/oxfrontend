import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from '../../../api/axiosInstance';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const handleVerifyOtp = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    try {
      const response = await axios.post('/profile/resetPass', {
        email,
        otpp: otp,
        newpassword: newPassword,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password changed successfully');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Failed', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log('❌ OTP Verify Error:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor={'black'}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        placeholderTextColor={'black'}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color:"black"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
