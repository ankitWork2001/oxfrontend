import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import SignUpLoginHeadPart from '../../../components/Header/SignInLoginHeadPart';
// import { AuthContext } from '../../../context/AuthContext';
import Loader from '../../../components/Loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../../redux/slices/authSlice';
import {getEmployeeById} from '../../../redux/slices/userSlice';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const {height, width} = Dimensions.get('window');
  // const { login, loading, errorMsg } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(true);
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const errorMsg = useSelector(state => state.auth.errorMsg);
  const {userDetails} = useSelector(state => state.user);
  const handleLogin = async () => {
    if (!email.trim()) {
      setBadEmail(true);
      Alert.alert('Message', 'Please Enter Email');
      return;
    } else if (!password.trim()) {
      setBadPassword(true);
      Alert.alert('Message', 'Please Enter Password');
      return;
    }
    try {
      
      const resultAction = await dispatch(login({email, password}));
      if (login.fulfilled.match(resultAction)) {
        // Alert.alert('Success', 'Login Success');
        //  load token and userId
        const token = resultAction.payload?.token || resultAction.payload;
        await AsyncStorage.setItem('userToken', token);
        const savedToken = await AsyncStorage.getItem('userToken');
        // console.log('🟢 Saved Token:', savedToken);
        // Alert.alert("Saved Token", savedToken || 'null');
        const decoded = jwtDecode(token);
        const userId = decoded?.id;

        //  Fetch user details
        const userResult = await dispatch(getEmployeeById(userId));
        const user = userResult.payload;
        // Navigate based on role
        const role = user?.role?.toLowerCase();

        setTimeout(() => {
          if (role === 'admin') {
            navigation.replace('AdminPanel');
          } else if (role === 'user') {
            navigation.replace('MainTabs');
          } else {
            navigation.navigate('WelcomeScreen');
          }
        }, 1000);
      } else {
        Alert.alert('Login Failed', resultAction.payload || 'Unknown error');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };
  const textFill = (text, fieldName) => {
    if (fieldName === 'email') {
      setEmail(text);
      setBadEmail(false);
      return;
    } else if (fieldName === 'password') {
      setPassword(text);
      setBadPassword(false);
      return;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <SignUpLoginHeadPart showCreateAcount={true} title={'Log In'} />
      <View style={styles.body}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>

        <Text style={styles.label}>E-Mail Address / Phone Number</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => textFill(text, 'email')}
          placeholderTextColor={'#000'}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            value={password}
            onChangeText={text => textFill(text, 'password')}
            secureTextEntry={showPassword}
            placeholderTextColor={'#000'}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              style={[styles.icon, {right: width * 0.01, top: height * 0.012}]}
              name="visibility"
              size={18}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            {loading ? (
              <ActivityIndicator size={24} color={'#fff'} />
            ) : (
              'Log In'
            )}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.loginWith}>Log In With</Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.socialIconContainer}>
          <TouchableOpacity style={styles.button}>
            <Image
              style={styles.socialIcon}
              source={require('../../../assests/googleLogo.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image
              style={styles.socialIcon}
              source={require('../../../assests/appleLogo.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image
              style={styles.socialIcon}
              source={require('../../../assests/facebookLogo.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}
          style={styles.dontHaveView}>
          <Text style={styles.signInLink}>Don't Have Account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -100,
  },
  welcomeText: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#FF8800',
    marginBottom: 15,
  },
  label: {
    fontSize: RFValue(16),
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  inputPassword: {
    width: '90%',
    color: '#000',
    // flex: 1
  },
  icon: {
    position: 'absolute',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  forgotPasswordText: {
    fontSize: RFValue(10),
    color: '#555',
  },
  loginButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
    height: 50,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: RFValue(14),
    fontWeight: '400',
  },
  orText: {
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 10,
    fontSize: RFValue(12),
    fontWeight: 600,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  loginWith: {
    marginHorizontal: 10,
    fontSize: RFValue(12),
    color: '#888',
  },
  socialIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#E7E7E7',
    padding: 10,
    borderRadius: 7,
  },
  socialIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  signUpPrompt: {
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: RFValue(12),
    color: '#000',
  },
  signInLink: {
    color: 'green',
    fontWeight: '600',
  },
  dontHaveView: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default LoginScreen;
