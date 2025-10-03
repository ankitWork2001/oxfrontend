import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  useWindowDimensions,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeById } from '../../../redux/slices/userSlice';
import { decodeUserFromToken } from '../../../utils/auth';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserToken } from '../../../redux/slices/authSlice';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const adjustedHeight = Platform.OS === 'android' ? height + StatusBar.currentHeight : height;

  const { userToken, loading } = useSelector((state) => state.auth);
  const { userDetails } = useSelector((state) => state.user);

  // ✅ Load token from AsyncStorage on app start
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('📦 Loaded token from storage:', storedToken);
        if (storedToken) {
          dispatch(setUserToken(storedToken));
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };

    fetchToken();
  }, []);

  // ✅ Fetch user details if token exists
  useEffect(() => {
    if (!loading && userToken) {
      const decoded = decodeUserFromToken(userToken);
      if (decoded?.id) {
        dispatch(getEmployeeById(decoded.id));
      }
    }
  }, [userToken, loading]);

  // ✅ Navigate after user and token are ready
  useEffect(() => {
    if (loading) return;

    if (!userToken) {
      const timer = setTimeout(() => {
        navigation.replace('WelcomeScreen');
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (!userDetails) {
      const timer = setTimeout(() => {
        navigation.replace('WelcomeScreen');
      }, 2000);
      return () => clearTimeout(timer);
    }

    const role = userDetails?.role?.toLowerCase();
    const timer = setTimeout(() => {
      if (role === 'user') {
        navigation.replace('MainTabs');
      } else if (role === 'admin') {
        navigation.replace('AdminPanel');
      } else {
        navigation.replace('WelcomeScreen');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [loading, userToken, userDetails]);

  // ✅ Set nav bar color
  useEffect(() => {
    changeNavigationBarColor('transparent', true);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent hidden={true} />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../../assests/Landing4x.png')}
          style={{ width: '100%', height: adjustedHeight, flex: 1 }}
          resizeMode="cover"
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Image
              source={require('../../../assests/SplashWheel.png')}
              resizeMode="cover"
              style={{ width: 400, height: 380, top: 55 }}
            />
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default SplashScreen;
