import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeById } from '../../../redux/slices/userSlice';
import jwtDecode from 'jwt-decode';
import Loader from '../../../components/Loader/Loader';


const ProfileScreenUpperside = () => {
    const { height } = Dimensions.get('window');
    const navigation = useNavigation()
    // const dispatch = useDispatch();
    const { userId } = useSelector((state) => state.auth);
    const { userDetails, wallet, loading } = useSelector((state) => state.user);
    // console.log('User ID:', userId);
    // console.log('User Details:', userDetails);

    return (
        <SafeAreaView style={styles.MainContainer}>
            <View style={[styles.profileUppersideContainer, { backgroundColor: '#34A853' }]}>
                <View style={styles.IconMainContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    ><Icon name='arrow-back' size={24} color='#fff' /></TouchableOpacity>
                    {/* <View style={styles.IconSubContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                        ><Icon name='edit-square' size={24} color='#fff' /></TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                        ><Icon name='settings' size={24} color='#fff' /></TouchableOpacity>
                    </View> */}
                </View>

                <View style={[styles.profileImageAndTextContainer, { bottom: height * 0.06 }]}>
                    <Image
                        source={{
                            uri: userDetails.avatarUrl
                                ? userDetails.avatarUrl
                                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBwdXILD8UEHD_k8M2d-fvNLi9yBMMO3KXQ&s',
                            resizeMode: 'cover',

                        }}

                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}> {userDetails.name || 'User'}</Text>
                    <Text style={styles.profileID}>ID:EMP12345</Text>
                    <View style={styles.balanceBox}>
                        <Text style={styles.BalanceText}>Balance: ${wallet.balance || '0.00'}</Text>
                    </View>
                    <Icon style={styles.doubleArrowIcon}
                        color='#FFFFFF'
                        name='keyboard-double-arrow-down'
                        size={24}
                    />

                    <View style={styles.depositAndWithdrawContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('UserDeposit')}
                            style={[
                                styles.depositTextBox,
                                {
                                    backgroundColor: '#0653D1',
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                },
                            ]}
                        >
                            <Text style={styles.depositText}>Deposit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('UserWithdraw')}
                            style={[
                                styles.depositTextBox,
                                {
                                    backgroundColor: '#FDBE00',
                                    borderTopRightRadius: 6,
                                    borderBottomRightRadius: 6,
                                },
                            ]}
                        >
                            <Text style={styles.depositText}>
                                Withdraw{'\n'}
                                <Text style={styles.rulesText}>Rules: 24hr lock, Min $100</Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            <View style={[styles.levelContainer, { bottom: height * 0.04 }]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.levelItem}>
                    <Icon name='diamond' size={22} color='#9747FF' />
                    <Text style={styles.levelText}>Level: 5 {'\n'}(Silver)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.levelItem}>
                    <Text style={styles.levelEmoji}>🏆</Text>
                    <Text style={styles.levelText}>Total{'\n'}Wins:$560</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SpinScreen')}
                    activeOpacity={1}
                    style={styles.levelItem}>
                    <Icon name='radar' size={22} color='#DB0004' />
                    {/* <Text style={styles.levelText}>Spin Left {'\n'}Today:2/5</Text> */}
                    <Text style={styles.levelText}>Spin Left Today:{userDetails.spinCount}/3</Text>
                </TouchableOpacity>
            </View>
            {/* <Loader visible={loading} /> */}
        </SafeAreaView>
    )
}

export default ProfileScreenUpperside

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileUppersideContainer: {},
    IconMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginHorizontal: 20,
        marginVertical: 30,
        padding: 10,
    },
    IconSubContainer: {
        flexDirection: 'row',
        gap: 10
    },
    profileImageAndTextContainer: {
        alignItems: "center"
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#000',
        overflow: 'hidden',

    },
    profileName: {
        fontSize: RFValue(24),
        fontWeight: '400',
        color: '#fff',
        marginTop: 10
    },
    profileID: {
        color: '#fff',
        fontSize: RFValue(10),
        fontWeight: '500',
        marginTop: 2
    },
    balanceBox: {
        marginTop: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 1,
        borderRadius: 4,
        width: 130
    },
    BalanceText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 300,
    },
    doubleArrowIcon: {
        marginVertical: 15,
    },
    depositAndWithdrawContainer: {
        width: "80%",
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    depositTextBox: {
        width: "50%",
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    depositText: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center'
    },
    rulesText: {
        fontSize: RFValue(6),
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    levelItem: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 20,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        height: 80,
        shadowColor: 'blue',

    },
    levelEmoji: {
        fontSize: RFValue(22)
    },
    levelText: {
        fontSize: RFValue(10),
        fontWeight: '400',
        textAlign: 'center'
    },
})