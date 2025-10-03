import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const UserWithdrawOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const navigation = useNavigation();

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');

    if (fullOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
      return;
    }

    // For demo: You can validate OTP with API if needed
    Alert.alert('Success', 'Withdrawal OTP Verified Successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('WalletInfo'), // or any other screen
      },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.otpText}>Enter OTP</Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <View style={styles.inputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.input}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity style={styles.btn} onPress={handleVerify} activeOpacity={0.8}>
            <Text style={styles.btnText}>Verify & Withdraw</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default UserWithdrawOTP;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  otpText: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
    color:"black"
  },
  otpContainer: {
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('window').height * 0.37,
    justifyContent: 'space-around',
    
  },
  btn: {
    width: '50%',
    backgroundColor: '#FF8800',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
  },
  input: {
    width: 53,
    height: 50,
    borderWidth: 0.5,
    borderColor: '#00000036',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    color:"black"
  },
});
