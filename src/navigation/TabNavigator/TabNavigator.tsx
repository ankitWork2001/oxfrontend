import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SpinScreen from '../../screens/SpinWheel/SpinScreen';
import InvestScreen from '../../screens/Investment/InvestScreen';
import ReferralScreen from '../../screens/Referral/ReferralScreen/ReferralScreen';
import ProfileScreen from '../../screens/Profile/PersonalDetailsScreen/ProfileScreen';
import HomeScreen from '../../screens/Home/HomeScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#ccc',
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginBottom: 5,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Spin':
                            iconName = 'radar';
                            break;
                        case 'Invest':
                            iconName = 'attach-money';
                            break;
                        case 'Referral':
                            iconName = 'group';
                            break;
                        case 'Profile':
                            iconName = 'person';
                            break;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name={iconName} size={24} color={focused ? '#000' : '#fff'} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Spin" component={SpinScreen} />
            <Tab.Screen name="Invest" component={InvestScreen} />
            <Tab.Screen name="Referral" component={ReferralScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;

const styles = StyleSheet.create({
    tabBarStyle: {
        // height: 75,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#2E7D32', // green
        paddingBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // borderEndEndRadius:20
    }
});