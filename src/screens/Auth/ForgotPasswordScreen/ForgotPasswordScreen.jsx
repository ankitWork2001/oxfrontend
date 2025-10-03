import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from '../../../api/axiosInstance'; 

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleSendOtp = async () => {
    console.log("🚀 Button pressed, sending OTP to:", email);

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }

    try {
      const response = await axios.post('/profile/otp', { email });

      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        Alert.alert('Success', 'OTP sent to your email');
        navigation.navigate('OtpVerificationScreen', { email });
      } else {
        Alert.alert('Failed', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log("❌ OTP Error:", error.response?.status);
      console.log("❌ OTP Error Message:", error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP'
      );
    }
  };

return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Forgot Password</Text>

    <Text style={styles.subtitle}>
      Enter your email to receive an OTP for password reset.
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Enter your email"
      placeholderTextColor="#999"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <TouchableOpacity onPress={handleSendOtp} style={styles.sendButton}>
      <Text style={styles.sendButtonText}>Send OTP</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}
    >
      <Text style={styles.backText}>← Back to Login</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
    fontSize: 14,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: 'green',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
