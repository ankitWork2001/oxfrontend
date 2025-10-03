import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUpiId, verifyUpiIdOtp, depositFunds } from '../../redux/slices/walletSlice';

const UserDeposit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    amount: '',
    walletAddress: '',
    date: '',
    upiId: '',
    otp: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

const handleDateChange = (event, date) => {
  const currentDate = date || selectedDate;
  setShowDatePicker(Platform.OS === 'ios'); // keep iOS modal open until 'Done'
  setSelectedDate(currentDate);
  setForm({ ...form, date: currentDate.toISOString().split('T')[0] });
};

const openDatePicker = () => {
  setShowDatePicker(true);
};


const handleSendOtp = () => {
  // if (!form.upiId) return alert('Enter your Registered Email');

  Alert.alert(
    'Confirm Deposit',
    `Please check that your wallet address is correct before proceeding:\n\n${form.walletAddress}`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Proceed',
        onPress: async () => {
          const res = await dispatch(verifyUpiId({ upiId: form.upiId }));
          if (verifyUpiId.fulfilled.match(res)) {
            alert('OTP sent successfully!');
            setOtpSent(true);
          } else {
            alert(res.payload || 'Failed to send OTP');
          }
        },
      },
    ]
  );
};


  const handleVerifyOtp = async () => {
    if (!form.otp) return alert('Enter OTP');
    const res = await dispatch(verifyUpiIdOtp({ otp: form.otp }));
    if (verifyUpiIdOtp.fulfilled.match(res)) {
      alert('OTP Verified');
      setOtpVerified(true);
    } else {
      alert(res.payload || 'OTP verification failed');
    }
  };

  const handleDeposit = async () => {
    const { amount, walletAddress, date } = form;
    if (!amount || !walletAddress || !date) {
      return alert('Please fill all fields');
    }
    if (!otpVerified) {
      return alert('Verify OTP first');
    }

    const res = await dispatch(depositFunds({ amount, walletAddress, date }));
    if (depositFunds.fulfilled.match(res)) {
      alert('Deposit submitted to admin successfully');
      setForm({ amount: '', walletAddress: '', date: '', upiId: '', otp: '' });
      setOtpSent(false);
      setOtpVerified(false);
    } else {
      alert(res.payload || 'Deposit failed');
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
                <MaterialIcons name="payments" size={30} color="#fff" />
              </View>
              <Text style={styles.headerText}>
                Hello {userDetails?.name || 'User'}, fund your account securely!
              </Text>
              <View style={styles.headerIcons}>
                <Text style={styles.balanceText}>
                  Balance : ${userDetails?.wallet?.balance || '0'}
                </Text>
                <Image
                  source={require('../../assests/WithdrawImage.png')}
                  resizeMode="cover"
                  style={styles.balanceImage}
                />
              </View>
            </View>

            <View style={styles.withdrawalContainer}>
              <View style={styles.withdrawView}>
                <Text style={styles.withdrawalHeaderText}>Deposit</Text>

                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Enter amount"
                    placeholderTextColor="#8F8F8F"
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.amount}
                    onChangeText={(v) => handleChange('amount', v)}
                  />
                </View>

                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Enter Binance #ID"
                    placeholderTextColor="#8F8F8F"
                    style={styles.input}
                    value={form.walletAddress}
                    onChangeText={(v) => handleChange('walletAddress', v)}
                  />
                </View>

               <View style={styles.textInput}>
  <TouchableOpacity onPress={openDatePicker} style={{ height: 45, justifyContent: 'center' }}>
    <Text style={{ color: form.date ? '#000' : '#8F8F8F', marginLeft: 10 }}>
      {form.date || 'Select Date'}
    </Text>
  </TouchableOpacity>
</View>

{/* iOS DatePicker Modal */}
{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={handleDateChange}
    maximumDate={new Date()}
  />
)}

                {/* <View style={styles.textInput}>
                  <TextInput
                    placeholder="Enter your Registered email"
                    placeholderTextColor="#8F8F8F"
                    style={styles.input}
                    value={form.upiId}
                    onChangeText={(v) => handleChange('upiId', v)}
                    autoCapitalize="none"
                  />
                </View> */}

                <Text style={styles.labelText}>Select Payment Method</Text>
                <View style={styles.paymentOption}>
                  <View style={styles.optionCard}>
                    <Image
                      source={require('../../assests/Crypto.png')}
                      resizeMode="cover"
                      style={styles.image}
                    />
                    <Text style={styles.text}>Binance</Text>
                  </View>
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
                        value={form.otp}
                        onChangeText={(v) => handleChange('otp', v)}
                      />
                    </View>
                    <TouchableOpacity style={styles.otpBtn} onPress={handleVerifyOtp}>
                      <Text style={styles.otpBtnText}>Verify OTP</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.otpBtn} onPress={handleDeposit}>
                    <Text style={styles.otpBtnText}>Deposit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default UserDeposit;

// styles remain exactly the same (unchanged)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 30,
  },
  headerContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#1e88e5',
    paddingTop: 30,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 15,
    marginLeft: 20,
    color: '#fff',
    marginTop: 10,
  },
  balanceText: {
    fontSize: 24,
    color: '#F0F5F5',
    marginLeft: 5,
  },
  balanceImage: {
    width: 203,
    height: 169,
    bottom: 8,
  },
  withdrawalContainer: {
    alignItems: 'center',
  },
  withdrawView: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    gap: 10,
    marginTop: 40,
  },
  withdrawalHeaderText: {
    fontSize: 20,
    color: '#1E3D3D',
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#00000036',
    marginTop: 8,
  },
  input: {
    marginLeft: 10,
    height: 45,
    color: '#000',
  },
  labelText: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 20,
    fontSize: 13,
    fontWeight: '300',
    color: '#000000',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 6,
    elevation: 2,
    backgroundColor: '#fff',
    borderColor: '#00000036',
    borderWidth: 0.5,
    width: '50%',
    justifyContent: 'space-evenly',
    height: 40,
  },
  image: {
    width: 28,
    height: 27,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  otpBtn: {
    backgroundColor: '#FF8800',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    borderRadius: 6,
    elevation: 2,
  },
  otpBtnText: {
    color: '#F0F5F5',
    fontWeight: '500',
    fontSize: 15,
  },
});
