import { Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

const SpinPageBackSide = () => {
    const { height, width } = Dimensions.get('window');
    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={styles.mainContainer}>
                <View>
                    <Image
                        source={require('../../assests/spinPageVectorImage.png')}
                        style={styles.vectorImage}
                    />
                </View>
                <View style={[styles.contentTextContainer, { bottom: height * 0.12 }]}>
                    <Text style={styles.FortuneText}>Fortune Awaits{'\n'}<Text> You!</Text></Text>
                    <Text style={styles.spinContentText}>Spin the Wheel and Score Big Today!</Text>
                </View>
                <View>
                    <Image
                        source={require('../../assests/spinPageRightSideVectorImage.png')}
                        style={[styles.vectorImage, { bottom: height * 0.14, right: width * -0.76 }]}
                    />
                </View>
            </SafeAreaView >
        </>
    )
}

export default SpinPageBackSide

const styles = StyleSheet.create({
    mainContainer: {
        // flex: 1,
    },
    vectorImage: {
        resizeMode: 'contain'
    },
    contentTextContainer: {},
    FortuneText: {
        fontSize: RFValue(36),
        fontWeight: '700',
        color: '#ffff',
        textAlign: 'center'
    },
    spinContentText: {
        color: '#ffff',
        textAlign: 'center',
        fontSize: RFValue(16)
    },
})