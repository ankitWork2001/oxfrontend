import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileScreenUpperside from './ProfileScreenUpperside';
import ProfileScreenDownrside from './ProfileScreenDownrside';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeById } from '../../../redux/slices/userSlice';
import Loader from '../../../components/Loader/Loader';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');

  const { userId } = useSelector((state) => state.auth);
  const { userDetails, wallet, loading } = useSelector((state) => state.user);

  const isGuest = !userId;
  const isLoading = loading || (!userDetails && !isGuest);

  useEffect(() => {
    if (userId) {
      dispatch(getEmployeeById(userId));
    }
  }, [userId]);

  // Navigate to Welcome screen
  const handleLoginPress = () => {
    navigation.navigate('WelcomeScreen'); // Make sure "WelcomeScreen" is registered in your navigator
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
      {isGuest ? (
        <SafeAreaView style={styles.MainContainer}>
          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>Please log in to view your profile.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <SafeAreaView style={styles.MainContainer}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            showsVerticalScrollIndicator={false}
          >
            <ProfileScreenUpperside />
            <ProfileScreenDownrside />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  guestText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#34A853',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
