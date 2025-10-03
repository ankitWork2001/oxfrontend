import { StatusBar, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllNotifications, getAllNotifications } from '../../redux/slices/notificationSlice';


const SettingsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    // const { notifications, loading, errorMsg, successMsg } = useSelector((state) => state.notification)


    // useEffect(() => {
    //     dispatch(getAllNotifications())
    // }, [dispatch])

    return (
        <SafeAreaView style={styles.cardContainer}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            {/* Header */}
            <View style={styles.headerContentContainer}>
                <View style={styles.headerTextContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Settings</Text>
                   
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                >
                    <Icon name="notifications" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Options Card */}
            <View style={styles.card}>
                {/* Account Setting */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="person" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>Account Setting</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />

                {/* Notifications */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                       
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="notifications" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>Notifications</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />

                {/* App Preference */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="tune" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>App Preference</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />

                {/* Help & FAQ */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="help" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>Help & FAQ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />

                {/* Legal */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="gavel" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>Legal</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />

                {/* Others */}
                <View style={styles.option}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={styles.labelContainer}>
                            <Icon name="more-horiz" size={24} color="#000" style={styles.icon} />
                            <Text style={styles.label}>Others</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Icon name="chevron-right" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: '#fff',

    },
    headerContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#34A853',
        paddingVertical: 40,
        paddingHorizontal: 10,
    },
    headerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerText: {
        fontSize: RFValue(20),
        fontWeight: '500',
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 20,
        marginTop: 40,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginVertical: 3,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 20,
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
});
