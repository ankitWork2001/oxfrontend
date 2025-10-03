import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { verifyUpiId,verifyUpiIdOtp } from '../../../redux/slices/walletSlice';

const VerifyUpiIdScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!email.includes('@')) return alert('Enter a valid email address');
    const res = await dispatch(verifyUpiId({ upiId: email }));
    if (verifyUpiId.fulfilled.match(res)) {
      alert('OTP sent successfully!');
      setOtpSent(true);
    } else {
      alert(res.payload || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Enter OTP');
    const res = await dispatch(verifyUpiIdOtp({ otp }));
    if (verifyUpiIdOtp.fulfilled.match(res)) {
      alert('OTP Verified');
      setOtpVerified(true);
      navigation.goBack();
    } else {
      alert(res.payload || 'OTP verification failed');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.mainContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
                <MaterialIcons name="verified-user" size={30} color="#fff" />
              </View>
              <Text style={styles.headerText}>
                Secure your account with OTP verification
              </Text>
            </View>

            <View style={styles.withdrawalContainer}>
              <View style={styles.withdrawView}>
                <Text style={styles.withdrawalHeaderText}>Binance Verification</Text>

                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Enter your Binance Address"
                    placeholderTextColor="#8F8F8F"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>

                {!otpSent ? (
                  <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp}>
                    <Text style={styles.otpBtnText}>Send OTP</Text>
                  </TouchableOpacity>
                ) : !otpVerified ? (
                  <>
                    <View style={styles.textInput}>
                      <TextInput
                        placeholder="Enter OTP"
                        placeholderTextColor="#8F8F8F"
                        style={styles.input}
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={setOtp}
                      />
                    </View>
                    <TouchableOpacity style={styles.otpBtn} onPress={handleVerifyOtp}>
                      <Text style={styles.otpBtnText}>Verify OTP</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={{ color: 'green', fontWeight: 'bold' }}>Email Verified ✅</Text>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default VerifyUpiIdScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#1e88e5',
    paddingTop: 30,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerText: {
    fontSize: 15,
    color: '#fff',
    marginTop: 20,
    paddingBottom:9
  },
  withdrawalContainer: {
    alignItems: 'center',
  },
  withdrawView: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    padding: 20,
    borderRadius: 10,
    marginTop: 40,
  },
  withdrawalHeaderText: {
    fontSize: 20,
    color: '#1E3D3D',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#00000036',
    marginBottom: 16,
  },
  input: {
    marginLeft: 10,
    height: 45,
    color: '#000',
  },
  otpBtn: {
    backgroundColor: '#FF8800',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 6,
    elevation: 2,
  },
  otpBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
