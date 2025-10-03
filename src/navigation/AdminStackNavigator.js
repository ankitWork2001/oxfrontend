import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashBoardScreen from '../screens/adminTemplateScreens/DashBoardScreen';
import UsersScreen from '../screens/adminTemplateScreens/UsersScreen';

import SpinLogsScreen from '../screens/adminTemplateScreens/SpinLogsScreen';
import DepositsScreen from '../screens/adminTemplateScreens/DepositsScreen';
import WithdrawalsScreen from '../screens/adminTemplateScreens/WithdrawalsScreen';
import AdminSettingsScreen from '../screens/adminTemplateScreens/AdminSettingsScreen';
import InvestmentsScreen from '../screens/adminTemplateScreens/InvestmentsScreen';
import ApproveWithdrawal from '../screens/adminTemplateScreens/ApproveWithdrawal';

import UserDetailsScreen from '../screens/adminTemplateScreens/UserDetailsScreen';
import AddNewInvestment from '../screens/adminTemplateScreens/AddNewInvestment';
import ReferralsScreen from '../screens/adminTemplateScreens/ReferralsScreen';
import InvestmentPlans from '../screens/adminTemplateScreens/InvestmentPlans';
import ReportingTransactionScreen from '../screens/adminTemplateScreens/ReportingTransactionScreen';
import EditPlanScreen from '../screens/adminTemplateScreens/EditPlanScreen';
import ReferralScreen from '../screens/Referral/ReferralScreen/ReferralScreen';
const Stack = createNativeStackNavigator();

const AdminStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom'
        }}
        >
            
            <Stack.Screen name="Home" component={DashBoardScreen} />
            <Stack.Screen name="Users" component={UsersScreen} />
            <Stack.Screen name="Investments" component={InvestmentsScreen} />
            <Stack.Screen name="SpinLogs" component={SpinLogsScreen} />
            <Stack.Screen name="Deposits" component={DepositsScreen} />
            <Stack.Screen name="Withdrawals" component={WithdrawalsScreen} />
            <Stack.Screen name="Settings" component={AdminSettingsScreen} />
            <Stack.Screen name='ApproveWithdrawal' component={ApproveWithdrawal} />
            <Stack.Screen name='UserDetailsScreen' component={UserDetailsScreen}/>
            <Stack.Screen name='AddNewInvestment' component={AddNewInvestment} />
            <Stack.Screen name='ReferralScreen' component={ReferralScreen} />
            {/* <Stack.Screen name='InvestmentPlans' component={InvestmentPlans} /> */}
            <Stack.Screen name='InvestmentPlans' component={InvestmentPlans} />
            <Stack.Screen name="EditPlan" component={EditPlanScreen} />
            <Stack.Screen name='ReportingTransactionScreen' component={ReportingTransactionScreen} />
        </Stack.Navigator>
    );
};

export default AdminStackNavigator;
