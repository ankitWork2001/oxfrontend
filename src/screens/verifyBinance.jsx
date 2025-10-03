import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { verifyBinanceAddress } from '../redux/slices/walletSlice';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import { RFValue } from 'react-native-responsive-fontsize';

const VerifyBinanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [address, setAddress] = useState('');
  const [verifiedAddress, setVerifiedAddress] = useState('');
  const [verified, setVerified] = useState(false);

  const showToast = (type, text1, text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleVerifyAddress = async () => {
    if (!address) return showToast('error', 'Error', 'Enter your Binance Address');

    const res = await dispatch(verifyBinanceAddress({ address }));

    if (verifyBinanceAddress.fulfilled.match(res)) {
      const message =
        res?.payload?.message ||
        res?.payload?.data?.message ||
        'Binance Address Verified Successfully';

      const verifiedAddr =
        res?.payload?.verifiedAddress
        res?.payload?.data?.verifiedAddress ||
        address;

      setVerifiedAddress(verifiedAddr);
      setVerified(true);
      Alert.alert('Success', message);
    } else {
      showToast('error', 'Failed', res.payload || 'Failed to verify address');
    }
  };

  const handleCopyAddress = () => {
    if (verifiedAddress) {
      Clipboard.setString(verifiedAddress);
      showToast('success', 'Copied!', 'Binance address copied to clipboard');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e88e5" translucent />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.mainContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Verify Binance</Text>

                <MaterialIcons name="verified-user" size={28} color="#fff" />
              </View>
              <Text style={styles.headerSubtitle}>
                Secure your account with Binance address verification
              </Text>
            </View>

            {/* Main Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>Binance Verification</Text>

              {/* Binance Address Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter your Binance Address"
                  placeholderTextColor="#8F8F8F"
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="none"
                />
              </View>

              {/* Verify Address */}
              <TouchableOpacity style={styles.otpBtn} onPress={handleVerifyAddress}>
                <Text style={styles.otpBtnText}>
                  {verified ? 'Verified' : 'Get Admin Binance Address'}
                </Text>
              </TouchableOpacity>

              {/* Verified Address Display */}
              {verified && verifiedAddress ? (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.successText}>Admin Binance Wallet Address</Text>
                  <Text style={styles.verifiedAddress}>{verifiedAddress}</Text>
                  <TouchableOpacity style={styles.copyBtn} onPress={handleCopyAddress}>
                    <Text style={styles.copyBtnText}>Copy Address</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Toast />
    </>
  );
};

export default VerifyBinanceScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1e88e5',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: RFValue(20),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  cardContainer: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 20,
    color: '#1E3D3D',
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 8,
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
    borderRadius: 8,
    elevation: 2,
  },
  otpBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  verifiedAddress: {
    color: '#555',
    fontSize: 14,
    marginBottom: 10,
  },
  copyBtn: {
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import { verifyBinanceAddress, verifyBinanceOtp } from '../redux/slices/walletSlice';
// import Toast from 'react-native-toast-message';
// import Clipboard from '@react-native-clipboard/clipboard';
// import { RFValue } from 'react-native-responsive-fontsize';

// const VerifyBinanceScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const [address, setAddress] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [verifiedAddress, setVerifiedAddress] = useState('');

//   const showToast = (type, text1, text2 = '') => {
//     Toast.show({
//       type,
//       text1,
//       text2,
//       position: 'bottom',
//       visibilityTime: 3000,
//     });
//   };

//   const handleSendOtp = async () => {
//     if (!address) return showToast('error', 'Error', 'Enter your Binance Address');

//     const res = await dispatch(verifyBinanceAddress({ address }));
//     if (verifyBinanceAddress.fulfilled.match(res)) {
//       Alert.alert('Success', 'OTP sent successfully!');
//       setOtpSent(true);
//     } else {
//       showToast('error', 'Failed', res.payload || 'Failed to send OTP');
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) return showToast('error', 'Error', 'Enter OTP');

//     const res = await dispatch(verifyBinanceOtp({ otp }));

//     if (verifyBinanceOtp.fulfilled.match(res)) {
//       const message =
//         res?.payload?.message ||
//         res?.payload?.data?.message ||
//         'Binance Address Verified Successfully';

//       const verifiedAddr =
//         res?.payload?.verifiedAddress ||
//         res?.payload?.data?.verifiedAddress ||
//         '';

//       setVerifiedAddress(verifiedAddr);
//       setOtpVerified(true);

//       Alert.alert('Success', message);
//     } else {
//       const errorMsg =
//         res?.payload?.message ||
//         res?.payload?.data?.message ||
//         'Binance Address verification failed';

//       showToast('error', 'Failed', errorMsg);
//     }
//   };

//   const handleCopyAddress = () => {
//     if (verifiedAddress) {
//       Clipboard.setString(verifiedAddress);
//       showToast('success', 'Copied!', 'Binance address copied to clipboard');
//     }
//   };

//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="#1e88e5" translucent />
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.mainContainer}>
//           <ScrollView keyboardShouldPersistTaps="handled">
//             {/* Header */}
//             <View style={styles.headerContainer}>
//               <View style={styles.headerRow}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                   <MaterialIcons name="arrow-back" size={28} color="#fff" />
//                 </TouchableOpacity>

//                 <Text style={styles.headerTitle}>Verify Binance</Text>

//                 <MaterialIcons name="verified-user" size={28} color="#fff" />
//               </View>
//               <Text style={styles.headerSubtitle}>
//                 Secure your account with OTP verification
//               </Text>
//             </View>

//             {/* Main Card */}
//             <View style={styles.cardContainer}>
//               <Text style={styles.cardTitle}>Binance Verification</Text>

//               {/* Binance Address Input */}
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   placeholder="Enter your Binance Address"
//                   placeholderTextColor="#8F8F8F"
//                   style={styles.input}
//                   value={address}
//                   onChangeText={setAddress}
//                   autoCapitalize="none"
//                 />
//               </View>

//               {/* Send OTP */}
//               {!otpSent ? (
//                 <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp}>
//                   <Text style={styles.otpBtnText}>Send OTP</Text>
//                 </TouchableOpacity>
//               ) : !otpVerified ? (
//                 <>
//                   {/* OTP Input */}
//                   <View style={styles.inputContainer}>
//                     <TextInput
//                       placeholder="Enter OTP"
//                       placeholderTextColor="#8F8F8F"
//                       style={styles.input}
//                       keyboardType="numeric"
//                       value={otp}
//                       onChangeText={setOtp}
//                     />
//                   </View>
//                   <TouchableOpacity style={styles.otpBtn} onPress={handleVerifyOtp}>
//                     <Text style={styles.otpBtnText}>Verify OTP</Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <View style={{ marginTop: 10 }}>
//                   <Text style={styles.successText}>Binance Address Verified ✅</Text>
//                   {verifiedAddress ? (
//                     <>
//                       <Text style={styles.verifiedAddress}>{verifiedAddress}</Text>
//                       <TouchableOpacity style={styles.copyBtn} onPress={handleCopyAddress}>
//                         <Text style={styles.copyBtnText}>Copy Address</Text>
//                       </TouchableOpacity>
//                     </>
//                   ) : null}
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </KeyboardAvoidingView>

//       <Toast />
//     </>
//   );
// };

// export default VerifyBinanceScreen;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   headerContainer: {
//     width: '100%',
//     backgroundColor: '#1e88e5',
//     paddingTop: Platform.OS === 'ios' ? 50 : 30,
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     fontSize: RFValue(20),
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   cardContainer: {
//     width: '90%',
//     backgroundColor: '#fff',
//     elevation: 4,
//     padding: 20,
//     borderRadius: 12,
//     marginTop: 30,
//     alignSelf: 'center',
//   },
//   cardTitle: {
//     fontSize: 20,
//     color: '#1E3D3D',
//     marginBottom: 20,
//     fontWeight: '600',
//   },
//   inputContainer: {
//     width: '100%',
//     backgroundColor: '#fff',
//     elevation: 2,
//     borderRadius: 8,
//     borderWidth: 0.5,
//     borderColor: '#00000036',
//     marginBottom: 16,
//   },
//   input: {
//     marginLeft: 10,
//     height: 45,
//     color: '#000',
//   },
//   otpBtn: {
//     backgroundColor: '#FF8800',
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 45,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   otpBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   successText: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   verifiedAddress: {
//     color: '#555',
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   copyBtn: {
//     backgroundColor: '#1e88e5',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   copyBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });
