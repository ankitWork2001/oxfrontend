import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeById } from '../../redux/slices/userSlice';
import { dispatchCommand } from 'react-native-reanimated';
import Loader from '../../components/Loader/Loader';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { useNavigation } from '@react-navigation/native';

const DashBoardScreen = () => {
    const inset = useSafeAreaInsets();
    const { height, width } = Dimensions.get('window');
    const { userId } = useSelector((state) => state.auth);
    const { dashboardStats, loading: dashboardLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { userDetails, loading: userLoading } = useSelector((state) => state.user);
    // console.log('userDetails', userDetails);
    // console.log('Dashboard Stats:', dashboardStats);
    useEffect(() => {
        if (userId) {
            dispatch(getEmployeeById(userId));
        }
    }, [userId, dispatch]);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const isLoading = userLoading || dashboardLoading;
    
    return (
        <>
            <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />

            <SafeAreaView style={{ flex: 1 }}>
                {
                    isLoading ? <Loader visible={isLoading} /> : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={[styles.scrollViewContent, { paddingBottom: inset.bottom + 50 }]}
                        >
                            <AdminTemplateHeaderPart name={`Hi ${userDetails ? userDetails?.name : 'User'}`} showSearch={false} />
                            <View style={styles.dashboardWrapper}>
                                <View style={[styles.buttonsContainer, { bottom: height * 0.050 }]}>
                                    <TouchableOpacity 
                                    activeOpacity={0.9}
                                    style={styles.buttons} 
                                    onPress={()=>navigation.navigate('Withdrawals')}
                                    >
                                        <Icon name='verified' size={20} color='#34A853' />
                                        <Text style={styles.buttonsText}>Approve{'\n'}Withdrawal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    activeOpacity={0.9}
                                    style={styles.buttons}>
                                        <Icon name='schedule' size={20} color='#FF8800' />
                                        <Text style={styles.buttonsText}>View Today’s{'\n'}Activity</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    onPress={()=>navigation.navigate('InvestmentPlans')}
                                    activeOpacity={0.9}
                                    style={styles.buttons}>
                                        <Icon name='add-box' size={20} color='#FF8800' />
                                        <Text style={styles.buttonsText}>Add New{'\n'}Investment</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.dashboardTitle}>Dashboard</Text>
                                <View style={styles.ongoingDashboardCardMainContainer}>
                                    <View style={styles.ongoingDashboardCardContainer}>
                                        <View style={[styles.ongoingDashboardCard, { backgroundColor: '#ACE6F1' }]}>
                                            <View style={styles.cardContainer}>
                                                <Icon name="group" size={36} color="#007A8A" />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.label}>Total Users</Text>
                                                    <Text style={styles.value}>{dashboardStats ? dashboardStats?.totalUsers : '0'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.ongoingDashboardCardText}>● +{dashboardStats?.todayUsers || 0} new today</Text>
                                            {/* <Text style={styles.ongoingDashboardCardText}>● 9,204 active this week (74%)</Text>
                                            <Text style={styles.ongoingDashboardCardText}>● ↑ 4.2% growth vs last week</Text> */}
                                        </View>

                                        <View style={[styles.ongoingDashboardCard, { backgroundColor: '#FBE7A1' }]}>
                                            <View style={styles.cardContainer}>
                                                <Icon name="upload" size={45} color="#D4A800" />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.label}>Total Deposits</Text>
                                                    <Text style={styles.value}>${dashboardStats ? dashboardStats?.totalDeposits : '0.00'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.ongoingDashboardCardText}>● +${dashboardStats?.todayDeposits || 0} today</Text>
                                            {/* <Text style={styles.ongoingDashboardCardText}>● 1,823 successful deposits this week</Text> */}
                                            {/* <Text style={styles.ongoingDashboardCardText}>● ↑ 6.7% growth vs last week</Text> */}
                                        </View>
                                    </View>

                                    <View style={styles.ongoingDashboardCardContainer}>
                                        <View style={[styles.ongoingDashboardCard, { backgroundColor: '#E9D5FF' }]}>
                                            <View style={styles.cardContainer}>
                                                <Icon name="download" size={45} color="#8B5CF6" />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.label}>Total Withdrawals</Text>
                                                    <Text style={styles.value}>${dashboardStats ? dashboardStats?.totalWithdrawals : '0.00'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.ongoingDashboardCardText}>● ${dashboardStats?.todayWithdrawals || 0} withdrawn today</Text>
                                            {/* <Text style={styles.ongoingDashboardCardText}>● Pending: $22,450</Text>
                                            <Text style={styles.ongoingDashboardCardText}>● ↓ 1.13% vs last week</Text> */}
                                        </View>

                                        <View style={[styles.ongoingDashboardCard, { backgroundColor: '#FBC6C6' }]}>
                                            <View style={styles.cardContainer}>
                                                <Icon name="group-add" size={45} color="#D94A4A" />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.label}>Total Referrals</Text>
                                                    <Text style={styles.value}>{dashboardStats ? dashboardStats?.totalReferrals : '0.00'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.ongoingDashboardCardText}>● +{dashboardStats?.todayReferrals || 0} new today</Text>
                                            {/* <Text style={styles.ongoingDashboardCardText}>● 1,560 active referrers</Text>
                                            <Text style={styles.ongoingDashboardCardText}>● Top earner: User #1023 ($3,200)</Text> */}
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.SignUpTrendView}>
                                    <Text style={styles.SignupTrendText}>Signup Trend</Text>
                                    <Feather name='edit' size={23} color='#000' />
                                </View>


                                <View style={styles.SignupTrendImageMainContainer}>
                                    <View style={styles.TextContainer}>
                                        <Text style={styles.TextHeader}>Users</Text>
                                        <Text style={styles.TextValues}>80</Text>
                                        <Text style={styles.TextValues}>60</Text>
                                        <Text style={styles.TextValues}>40</Text>
                                        <Text style={styles.TextValues}>20</Text>
                                        <Text style={styles.TextValues}>0</Text>
                                    </View>

                                    <View style={[styles.SignupTrendImageContainer, { left: width * 0.01 }]}>
                                        <Image
                                            source={require('../../assests/signUpTerndImageDays.png')}
                                            style={styles.SignupTrendImageDays}
                                        />
                                        <Image
                                            source={require('../../assests/signUpTrendImage.png')}
                                            style={styles.SignupTrendImage}
                                        />
                                        <View style={[styles.TextTimeContainer, { bottom: height * 0.01 }]}>
                                            <Text style={styles.TextValues}>11 am</Text>
                                            <Text style={styles.TextValues}>12 pm</Text>
                                            <Text style={styles.TextValues}>1 pm</Text>
                                            <Text style={styles.TextValues}>2 pm</Text>
                                            <Text style={styles.TextValues}>3 pm</Text>
                                        </View>
                                        <Text style={[styles.TextHeader, { right: width * 0.14 }]}>Time -</Text>
                                    </View>
                                </View>
                                <Text style={styles.SignupTrendText}>Investment Plan Usage</Text>

                                <View style={styles.card}>
                                    {/* Left Side: Legend */}
                                    <View style={styles.legendContainer}>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: '#34A853' }]} />
                                            <View>
                                                <Text style={styles.label}>Basic Plan</Text>
                                                <Text style={styles.percentage}>45%</Text>
                                            </View>
                                        </View>

                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: '#F4B400' }]} />
                                            <View>
                                                <Text style={styles.label}>Gold Plan</Text>
                                                <Text style={styles.percentage}>20%</Text>
                                            </View>
                                        </View>

                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: '#A259FF' }]} />
                                            <View>
                                                <Text style={styles.label}>Premium Plan</Text>
                                                <Text style={styles.percentage}>35%</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Right Side: Static Pie Chart Image */}
                                    <View style={styles.chartImageContainer}>
                                        <Image
                                            source={require('../../assests/investment_plan_pie_chart.png')}
                                            style={[styles.chartImage, { right: width * 0.15 }]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )
                }

            </SafeAreaView>
        </>
    );
};

export default DashBoardScreen;

const styles = StyleSheet.create({
    scrollViewContent: {
        backgroundColor: '#fff',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttons: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        borderRadius: 6,
        elevation: 6,
        width: '30%',
        height: 85,
    },
    buttonsText: {
        textAlign: 'center',
        color:"black"
    },
    dashboardWrapper: {
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    dashboardTitle: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
        color:'black'
    },
    SignupTrendText: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
    },
    ongoingDashboardCardMainContainer: {
        alignItems: 'center',
    },
    ongoingDashboardCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    ongoingDashboardCard: {
        width: '50%',
        borderRadius: 6,
        padding: 15,
        marginVertical: 10,
        shadowRadius: 4,
        elevation: 5,
        shadowColor: '#000',
        marginHorizontal: 5,
        height: 100,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        color: '#000',
        fontSize: RFValue(10),
        fontWeight: '400'
    },
    value: {
        color: '#000',
        fontSize: RFValue(14),
        fontWeight: '400'
    },
    ongoingDashboardCardText: {
        fontSize: RFValue(8)
    },
    SignupTrendImageMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingLeft: 25,
        overflow: 'hidden',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    SignupTrendImageContainer: {
        width: Dimensions.get('window').width * 0.9,
        height: 200,
        justifyContent: 'center',
    },
    SignupTrendImage: {
        width: '80%',
        height: '70%',
        resizeMode: 'contain'
    },
    SignupTrendImageDays: {
        width: '80%',
        resizeMode: 'contain'
    },
    TextContainer: {
        gap: 8,
        marginBottom: 15
    },
    TextTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    TextHeader: {
        color: '#8F8F8F',
        fontSize: RFValue(12),
        fontWeight: '300',
        textAlign: 'center'
    },
    TextValues: {
        color: '#8F8F8F',
        fontSize: RFValue(10),
        fontWeight: '400'
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendContainer: {
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    percentage: {
        fontSize: 13,
        fontWeight: '400',
        color: '#000',
    },
    chartImageContainer: {
        width: Dimensions.get('window').width * 1,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    SignUpTrendView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
    },

});
