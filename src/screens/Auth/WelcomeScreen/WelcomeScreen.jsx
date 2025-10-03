import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../redux/slices/userSlice';

export default function WelcomeScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { height } = Dimensions.get('window');
    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <Image
                    source={require('../../../assests/welcome.png')}
                    style={styles.image}
                />
                <View style={[styles.overlay, { top: height * 0.05 }]}>
                    <Text style={styles.welcomeText}>Welcome to the Spin &{"\n"} Win Adventure!</Text>
                    <Text style={styles.spinTheWheelText}>Spin the wheel, invite friends, and unlock exciting rewards with every turn!</Text>
                </View>
                <View style={[styles.spinImageOverlay, { top: height * 0.17 }]}>
                    <Image
                        style={styles.spinImage}
                        source={require('../../../assests/WelcomeSpin.png')}
                        resizeMode='contain'
                    />
                </View>
            </View>
            <View style={[styles.buttonContainer, { top: 630 }]}>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={styles.button}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('LoginScreen')}
                        style={styles.loginbutton}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.guestRow}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            dispatch(clearUser());
                            navigation.replace('MainTabs');
                        }}
                        style={styles.guestButton}
                    >
                        <Text style={styles.guestText}>Continue as Guest <Text style={styles.arrow}>→</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.policy}>
                    <Text style={styles.agreePolicyText}>
                        By clicking Login or Signup, you agree to our
                        <Text style={styles.linkText}> Privacy Policy </Text>{"\n"}
                        And
                        <Text style={styles.linkText}> Terms of Services</Text>.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    guestRow: {
        alignItems: 'center',
        marginTop: 8,
    },
    guestButton: {
        backgroundColor: 'transparent',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    guestText: {
        color: '#34A853',
        fontSize: 13,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    arrow: {
        fontSize: 15,
        color: '#34A853',
    },
    mainContainer: {
        flex: 1,
    },
    image: {
        resizeMode: 'stretch',
        width: 'auto'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: RFValue(24, 600),
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    },
    spinTheWheelText: {
        color: 'white',
        fontSize: 9,
    },
    spinImageOverlay: {
        position: 'absolute',
        alignSelf: 'center',
    },
    spinImage: {
        width: 400,
        height: 550
    },
    buttonContainer: {
        position: "relative",
        display: "flex",
        gap: 15
    },
    button: {
        alignItems: 'center',
        backgroundColor: "#FF8800",
        padding: 10,
        marginHorizontal: 25,
        borderRadius: 6,
        elevation: 4,
    },
    loginbutton: {
        alignItems: 'center',
        backgroundColor: "#fff",
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 10,
        marginHorizontal: 25,
        borderRadius: 6,
        elevation: 4,
    },
    signupText: {
        fontSize: RFValue(14),
        fontWeight: '400',
        color: "white",
        textAlign: 'center'
    },
    loginText: {
        fontSize: RFValue(14),
        color: 'black',
        fontWeight: '400',
    },
    agreePolicyText: {
        fontSize: RFValue(10),
        textAlign: 'center',
        color: "#34A853"
    },
    linkText: {
        color: "#34A853"
    },
    policy: {
        marginTop: 20
    }
});

/**
 * To persist login state, use AsyncStorage to save user credentials/token after login,
 * and check for them on app start (e.g. in your root App.js or AuthProvider).
 * Example:
 * 
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * 
 * // On successful login:
 * await AsyncStorage.setItem('userToken', token);
 * 
 * // On app start:
 * const token = await AsyncStorage.getItem('userToken');
 * if (token) {
 *   // Navigate to MainTabs or Home
 * } else {
 *   // Navigate to WelcomeScreen
 * }
 * 
 * // On logout:
 * await AsyncStorage.removeItem('userToken');
 * 
 * Use a context/provider or state management to handle auth state globally.
 */