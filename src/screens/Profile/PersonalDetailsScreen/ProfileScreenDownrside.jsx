import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
const ProfileScreenDownrside = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleVerifyEmail = async () => {
        try {
            if (!user?.email) {
                Alert.alert("Email not found", "Your profile doesn't have an email.");
                return;
            }

            setLoading(true);
            const res = await dispatch(verifyUpiId(user.email)).unwrap(); // sends OTP
            setLoading(false);

            Alert.alert("Success", res?.message || "OTP sent to your email");

            navigation.navigate("VerifyEmailOtpScreen", { email: user.email });
        } catch (err) {
            setLoading(false);
            Alert.alert("Error", err?.message || "Failed to send OTP");
        }
    };

    const handleLogout = async () => {

        setLoading(true);
        try {
            await dispatch(logout());
            setTimeout(() => {
                setLoading(false);
                navigation.replace('WelcomeScreen');
            }, 1500);
        } catch (error) {
            console.error('Logout Error:', error.message);
        }
    };
    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <TouchableOpacity onPress={() => { navigation.navigate('PersonalDetails') }} style={styles.option}>
                    <Icon name="person" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Personal Details</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity onPress={() => { navigation.navigate('WalletInfo') }} style={styles.option}>
                    <Icon name="wallet" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Wallet Info</Text>
                </TouchableOpacity>
                <View style={styles.separator} />

                <View style={styles.separator} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('VerifyBinance')}
                    style={styles.option}
                >
                    <Icon name="mail" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Get Admin Binance Address</Text>
                </TouchableOpacity>


                <View style={styles.separator} />
                <TouchableOpacity onPress={() => { navigation.navigate('TransactionHistory') }} style={styles.option}>
                    <Icon name="history" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Transaction History</Text>
                </TouchableOpacity>
                <View style={styles.separator} />

            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                style={styles.signOutButton}
                disabled={loading}

            >
                {loading ?
                    <ActivityIndicator size='small' color="#fff" />
                    : (<Text style={styles.signOutText}>Log Out</Text>)
                }

            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreenDownrside

const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "90%",
        shadowColor: 'blue'
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginVertical: 3
    },
    icon: {
        marginRight: 20
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
    signOutButton: {
        backgroundColor: '#FF8800',
        paddingVertical: 10,
        borderRadius: 6,
        marginTop: 40,
        alignSelf: 'center',
        paddingHorizontal: 60,
        elevation: 2,
        shadowColor: '#000',
        width: '50%',
    },
    signOutText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
})