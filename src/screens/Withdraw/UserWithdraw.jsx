import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';
import {
  verifyUpiId,
  verifyUpiIdOtp,
  withdrawFunds,
} from '../../redux/slices/walletSlice';

const UserWithdraw = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userDetails} = useSelector(state => state.user);

  const [form, setForm] = useState({
    amount: '',
    walletAddress: '',
    date: '',
    upiId: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const handleDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(Platform.OS === 'ios'); // keep iOS modal open until 'Done'
    setSelectedDate(currentDate);
    setForm({...form, date: currentDate.toISOString().split('T')[0]});
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleSendOtp = async () => {
    if (!form.amount) {
      return Alert.alert('Error', 'Enter withdrawal amount first');
    }

    if (parseFloat(form.amount) < 50) {
      return Alert.alert('Error', 'Minimum withdrawal is $50');
    }

    // if (!form.upiId) return Alert.alert('Error', 'Enter UPI-linked email');

    // ✅ Confirm wallet address before sending OTP
    Alert.alert(
      'Confirm Withdrawal',
      `Please check that your wallet address is correct before proceeding:\n\n${form.walletAddress}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          onPress: async () => {
            const res = await dispatch(verifyUpiId(form.upiId));
            if (verifyUpiId.fulfilled.match(res)) {
              Alert.alert('Success', 'OTP sent to your email');
              setOtpSent(true);
            } else {
              Alert.alert('Error', res.payload || 'Failed to send OTP');
            }
          },
        },
      ],
    );
  };

  const handleVerifyOtp = async () => {
    const res = await dispatch(
      verifyUpiIdOtp({upiId: form.upiId, otp: form.otp}),
    );
    if (verifyUpiIdOtp.fulfilled.match(res)) {
      Alert.alert('Success', 'OTP verified');
      setOtpVerified(true);
    } else {
      Alert.alert('Error', res.payload || 'OTP verification failed');
    }
  };

  const handleWithdraw = async () => {
    const {amount, walletAddress, date} = form;

    if (!amount || !walletAddress || !date) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    if (!otpVerified) return Alert.alert('Error', 'Verify OTP first');

    const res = await dispatch(withdrawFunds({amount, walletAddress, date}));
    if (withdrawFunds.fulfilled.match(res)) {
      Alert.alert('Success', 'Withdrawal request sent');
      setForm({amount: '', walletAddress: '', date: '', upiId: '', otp: ''});
      setOtpSent(false);
      setOtpVerified(false);
    } else {
      Alert.alert('Failed', res.payload || 'Withdraw failed');
    }
  };

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <MaterialIcons name="notifications" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.headerText}>
                Hi {userDetails?.name || 'User'}, cash out your {'\n'}rewards
                fast and safe!"
              </Text>
            </View>
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
              <Text style={styles.withdrawalHeaderText}>Withdrawal</Text>

              <View style={styles.textInput}>
                <TextInput
                  placeholder="Enter amount ($50 min)"
                  placeholderTextColor={'#8F8F8F'}
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.amount}
                  onChangeText={val => handleChange('amount', val)}
                />
              </View>

              <View style={styles.textInput}>
                <TextInput
                  placeholder="Enter wallet address"
                  placeholderTextColor={'#8F8F8F'}
                  style={styles.input}
                  value={form.walletAddress}
                  onChangeText={val => handleChange('walletAddress', val)}
                />
              </View>

              <View style={styles.textInput}>
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={{height: 45, justifyContent: 'center'}}>
                  <Text
                    style={{
                      color: form.date ? '#000' : '#8F8F8F',
                      marginLeft: 10,
                    }}>
                    {form.date || 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>

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
                  placeholder="Your Name"
                  placeholderTextColor={'#8F8F8F'}
                  style={styles.input}
                  value={userDetails?.name}
                  editable={false}
                />
              </View> */}

              {/* <View style={styles.textInput}>
                <TextInput
                  placeholder="Enter Your Registered Email"
                  placeholderTextColor={'#8F8F8F'}
                  style={styles.input}
                  value={form.upiId}
                  onChangeText={val => handleChange('upiId', val)}
                  keyboardType="email-address"
                />
              </View> */}

              <View style={styles.paymentOption}>
                <TouchableOpacity activeOpacity={0.7} style={styles.optionCard}>
                  <Image
                    source={require('../../assests/Crypto.png')}
                    resizeMode="cover"
                    style={styles.image}
                  />
                  <Text style={styles.text}>Binance</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSendOtp}
                style={styles.otpBtn}
                disabled={otpSent}>
                <Text style={styles.otpBtnText}>
                  {otpSent ? 'OTP Sent' : 'Send OTP'}
                </Text>
              </TouchableOpacity>

              {otpSent && (
                <>
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder="Enter OTP"
                      placeholderTextColor={'#8F8F8F'}
                      style={styles.input}
                      value={form.otp}
                      onChangeText={val => handleChange('otp', val)}
                      keyboardType="numeric"
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleVerifyOtp}
                    style={[
                      styles.otpBtn,
                      {backgroundColor: otpVerified ? '#6c757d' : '#28a745'},
                    ]}
                    disabled={otpVerified}>
                    <Text style={styles.otpBtnText}>
                      {otpVerified ? 'OTP Verified' : 'Verify OTP'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleWithdraw}
                style={styles.otpBtn}>
                <Text style={styles.otpBtnText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default UserWithdraw;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 30,
  },
  headerContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#34A853',
    paddingTop: 30,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  headerText: {
    textAlign: 'left',
    fontWeight: '400',
    fontSize: 15,
    marginLeft: 20,
    color: '#fff',
    marginTop: 10,
  },
  balanceText: {
    fontWeight: '400',
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
    fontWeight: '500',
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
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
  },
  optionCard: {
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    width: '28%',
    height: 40,
    justifyContent: 'space-evenly',
    borderWidth: 0.5,
    borderColor: '#00000036',
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
