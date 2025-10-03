import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loadToken } from '../../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../../redux/store'; // ✅ RootState added

import AuthStackNavigation from '../AuthNavigator/AuthNavigator';
import MainStackNavigation from '../MainStackNavigator';

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userToken, loading } = useSelector((state: RootState) => state.auth); // ✅ typed state

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  if (loading) return null; // you can show splash screen here

  return (
    <NavigationContainer>
      {/* Show different stack for guest vs logged-in user */}
      {userToken ? (
        <MainStackNavigation />
      ) : (
        <MainStackNavigation isGuest />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
