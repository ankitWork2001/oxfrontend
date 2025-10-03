import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {signup} from '../../../redux/slices/authSlice';
import SignUpLoginHeadPart from '../../../components/Header/SignInLoginHeadPart';
import PhoneInput from 'react-native-phone-number-input';

const SignUpScreen = () => {
  const {height, width} = Dimensions.get('window');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [formattedMobile, setFormattedMobile] = useState('');
  const [refrerCode, setReferCode] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const [badPassword, setBadPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badMobile, setBadMobile] = useState('');
  const [badName, setBadName] = useState('');
  const [badUserName, setBadUserName] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loading, errorMsg} = useSelector(state => state.auth);
  const phoneInput = useRef(null);

  const textFill = (text, fieldName) => {
    if (fieldName === 'name') {
      setName(text);
      setBadName(false);
    } else if (fieldName === 'userName') {
      setUserName(text);
      setBadUserName(false);
    } else if (fieldName === 'email') {
      setEmail(text);
      setBadEmail(false);
    } else if (fieldName === 'password') {
      setPassword(text);
      setBadPassword(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setBadName(true);
      Alert.alert('Message', 'Please Enter Name');
      return;
    }
    if (!userName.trim()) {
      setBadUserName(true);
      Alert.alert('Message', 'Please Enter Username');
      return;
    }
    if (!email.trim()) {
      setBadEmail(true);
      Alert.alert('Message', 'Please Enter Email');
      return;
    }
    if (!formattedMobile.trim()) {
      setBadMobile(true);
      Alert.alert('Message', 'Please Enter Mobile');
      return;
    }
    if (!password.trim()) {
      setBadPassword(true);
      Alert.alert('Message', 'Please Enter Password');
      return;
    }

    const resultAction = await dispatch(
      signup({
        name,
        username: userName,
        email,
        mobile: formattedMobile,
        password,
        referralCode: refrerCode,
      }),
    );

    if (signup.fulfilled.match(resultAction)) {
      Alert.alert('Success', 'Account created successfully');
      setName('');
      setUserName('');
      setEmail('');
      setMobile('');
      setFormattedMobile('');
      setPassword('');
      setReferCode('');
      setTimeout(() => {
        navigation.replace('LoginScreen');
      }, 2000);
    } else if (signup.rejected.match(resultAction)) {
      Alert.alert(
        'Signup Failed',
        resultAction.payload || 'Something went wrong',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <SignUpLoginHeadPart showCreateAcount={false} title="Sign Up" />
      </View>

      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            height: Dimensions.get('window').height * 1.5,
          }}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.welcomeText}>Welcome!</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            placeholderTextColor="#000"
            onChangeText={text => textFill(text, 'name')}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            placeholderTextColor="#000"
            onChangeText={text => textFill(text, 'userName')}
          />

          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            placeholderTextColor="#000"
            onChangeText={text => textFill(text, 'email')}
          />

          <Text style={styles.label}>Mobile</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={mobile}
            defaultCode="IN"
            layout="first"
            onChangeText={text => setMobile(text)}
            onChangeFormattedText={text => setFormattedMobile(text)}
            withShadow={false}
            containerStyle={styles.phoneInputStyle} // 👈 main wrapper
            textContainerStyle={{
              backgroundColor: '#fff', // 👈 for text background
              paddingVertical: 0,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
            
            textInputStyle={{color: '#000'}} // 👈 text color match
          />

          <Text style={styles.label}>Referral Code</Text>
          <TextInput
            style={styles.input}
            value={refrerCode}
            keyboardType="default"
            placeholderTextColor="#000"
            onChangeText={setReferCode}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              value={password}
              secureTextEntry={showPassword}
              placeholderTextColor="#000"
              onChangeText={text => textFill(text, 'password')}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                style={[
                  styles.icon,
                  {right: width * 0.01, top: height * 0.012},
                ]}
                name="visibility"
                size={18}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

        <TouchableOpacity
  onPress={handleSignUp}
  disabled={loading}
  activeOpacity={0.7}
  style={styles.loginButton}
>
  {loading ? (
    <ActivityIndicator size={24} color="#fff" />
  ) : (
    <Text style={styles.loginButtonText}>Sign Up</Text>
  )}
</TouchableOpacity>


          <Text style={styles.orText}>Or</Text>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.loginWith}>Sign Up With</Text>
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
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.dontHaveView}>
            <Text style={styles.signInLink}>
              Already Have an Account? Log In
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.35,
    position: 'relative',
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
    fontSize: RFValue(13),
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
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
  },
  icon: {
    position: 'absolute',
    marginRight: 5,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: RFValue(10),
    color: '#555',
  },
  loginButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 30,
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
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
    marginBottom: 20,
    marginTop: 20,
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
  signInLink: {
    textAlign: 'center',
    color: 'green',
    fontWeight: '600',
  },
  dontHaveView: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 1,
    paddingVertical: 2,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default SignUpScreen;
