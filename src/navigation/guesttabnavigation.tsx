import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import InvestScreen from '../screens/invest/InvestScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Tab = createBottomTabNavigator();

export default function GuestTabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Invest" component={InvestScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
  );
}
