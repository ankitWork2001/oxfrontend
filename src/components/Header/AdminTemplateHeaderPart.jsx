import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Dimensions, Image, StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AdminTemplateHeaderPart = ({ name, paddingBottom = 40 }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();
    const { height } = Dimensions.get('window');
    const [loading, setLoading] = useState(false);
    const inset = useSafeAreaInsets();
    const dispatch = useDispatch();
    const handleNavigate = (screen) => {
        setMenuVisible(false);
        navigation.navigate(screen);
    };
    const handleLogout = async () => {
        setLoading(true);
        try {
            await dispatch(logout());
            setTimeout(() => {
                setLoading(false);
                navigation.replace('AuthStack');
            }, 2000);

        } catch (error) {
            console.error('Logout Error:', error.message);

        }
    };
    return (
        <SafeAreaView edges={['left', 'right', 'bottom']}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
            <View style={[styles.headerContainer, { paddingBottom, paddingTop: inset.top }]}>
                <Text style={styles.greetingText}>{name}</Text>

                <View style={styles.iconGroup}>
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search..."
                            style={styles.searchInput}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.iconButton}>
                        <Fontisto name="bell" size={26} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.iconButton} onPress={() => setMenuVisible(true)}>
                        <Icon name="menu" size={30} color="#fff" />
                    </TouchableOpacity>
                    
                </View>
            </View>

            {/* Menu Modal */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.menu}>
                                <View style={styles.MenuItemImageContainer}>
                                    <Image
                                        source={require('../../assests/MenuHeadIcon.png')}
                                        style={styles.MenuItemImage}
                                    />
                                </View>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Home')}>
                                    <Icon name='dashboard' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Dashboard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Users')}>
                                    <Icon name='people' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Users</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Investments')}>
                                    <Icon name='work' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>User Investments</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('InvestmentPlans')}>
                                    <Icon name='fact-check' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Investment Plans</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('ReferralScreen')}>
                                    <Icon name='mobile-screen-share' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Referrals</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('SpinLogs')}>
                                    <Icon name='radar' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Spin Logs</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Deposits')}>
                                    <Icon name='file-upload' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Deposits</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Withdrawals')}>
                                    <Icon name='file-download' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Withdrawals</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('ReportingTransactionScreen')}>
                                    <Octicons name='arrow-switch' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Reporting and Transaction</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuButtons} onPress={() => handleNavigate('Settings')}>
                                    <Icon name='settings' size={24} color='#8F8F8F' />
                                    <Text style={styles.menuItem}>Settings</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleLogout}
                                    style={styles.menuLogoutButton}
                                    disabled={loading}
                                >
                                    {loading ?
                                        <ActivityIndicator size={23} color="#000" />
                                        : (<Text style={styles.menuLogoutButtonText}>Log Out</Text>)
                                    }

                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default AdminTemplateHeaderPart;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#34A853',
        paddingHorizontal: 16,
        paddingTop: 40,
        height: 250,
        width: '100%',
        justifyContent: "center",

    },
    greetingText: {
        fontSize: RFValue(20),
        color: '#fff',
        fontWeight: '400',
    },
    iconGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: "76%",
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 0,
    },
    iconButton: {
        marginLeft: 12,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menu: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 10,
        width: '50%',
        elevation: 5,
       
    },
    MenuItemImageContainer: {
        width: 32,
        height: 32,
        marginLeft: 65,
        marginVertical: 10
    },
    MenuItemImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    },
    menuButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 10,
        color: '#333',
    },
    menuLogoutButton: {
        marginVertical: 15,
        backgroundColor: '#D9D9D9',
        borderRadius: 6,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLogoutButtonText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        fontWeight: '500'
    },
});
