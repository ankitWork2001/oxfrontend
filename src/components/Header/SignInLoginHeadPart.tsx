import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SignUpLoginHeadPart = ({ showCreateAcount, title }) => {
    const { height, width } = Dimensions.get('window');
    const navigation = useNavigation();
    //     const topDollerImages = [{
    //         image1: require('../../assests/topDoller1.png'),
    //         image2: require('../../assests/topDoller2.png'),
    //     }

    //     ]
    //     const bottomDollerImages = [{
    //         image1: require('../../assests/topDoller2.png'),
    //         image2: require('../../assests/bottomDoller1.png'),

    //     }
    // ]
    const dollerImages = [
        { id: '1', uri: require('../../assests/topDoller1.png') },
        { id: '2', uri: require('../../assests/topDoller2.png') },
        { id: '3', uri: require('../../assests/bottomDoller1.png') },

    ];

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View>
                    <Image
                        source={require('../../assests/loginSiginBacckgroundImage.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.dollorImageContainer}>
                    {
                        dollerImages.slice(0, 2).map((item, index) => (
                            <View
                                key={index}

                            >
                                <Image
                                    resizeMode='contain'
                                    style={[{
                                        width: 100,
                                        height: 60
                                    }, { top: height * -0.43 }]}
                                    source={item.uri}
                                />
                            </View>
                        ))
                    }
                </View>
                <View style={[styles.dollorImageContainer, { top: 110, left: -30 }]}>
                    {
                        dollerImages.slice(1, 3).map((item, index) => (
                            <View
                                key={index}

                            >
                                <Image
                                    resizeMode='contain'
                                    style={[{
                                        width: 100,
                                        height: 80
                                    }, { top: height * -0.43 },

                                    ]}
                                    source={item.uri}
                                />
                            </View>
                        ))
                    }

                </View>
                <View style={[styles.loginAndCreateAccountContainer, { top: height * 0.09 }]}>
                    <View style={styles.loginArrowBackContain}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon style={styles.icon} name='arrow-back' size={20} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.loginText}>{title}</Text>
                    </View>


                    <View style={styles.loginArrowBackContain}>
                        {
                            showCreateAcount && (<TouchableOpacity
                                onPress={() => navigation.navigate('SignUpScreen')}
                                style={styles.createAccountButton}>
                                <Text style={styles.createNewText}>Create New Account</Text>
                            </TouchableOpacity>)
                        }

                    </View>
                </View>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        height: Dimensions.get("window").height * 0.35,
        position: 'relative',
    },
    image: {
        resizeMode: 'cover',
        width: "auto",
    },
    loginAndCreateAccountContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: "100%",
        paddingHorizontal: 10
    },
    loginArrowBackContain: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    icon: {
        fontSize: RFValue(22),
        color: "#FFFFFF"
    },
    loginText: {
        fontSize: RFValue(20),
        fontWeight: 400,
        color: "#FFFFFF"
    },
    createAccountButton: {
        alignItems: 'center',
        backgroundColor: "#FF8800",
        padding: 5,
        borderRadius: 4,
        elevation: 6,
    },
    createNewText: {
        color: "#FFFFFF",
        fontSize: RFValue(9),
    },
    dollorImageContainer: {

        flexDirection: 'row',
        justifyContent: 'space-around',
        top: 70

    }
})
export default SignUpLoginHeadPart