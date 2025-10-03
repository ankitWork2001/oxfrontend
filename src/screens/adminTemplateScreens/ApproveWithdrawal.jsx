import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Loader from '../../components/Loader/Loader'

import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart'
import Icon from 'react-native-vector-icons/MaterialIcons';
const ApproveWithdrawal = () => {
    const inset = useSafeAreaInsets();
    const { height, width } = Dimensions.get('window');
    // const {with}
    const isLoading = false
    const withdrawalApproval = [
        {
            id: 1,
            name: 'Lavkush',
            image: { uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' },
            time: '8.00 AM'
        },
        {
            id: 2,
            name: 'Ram Lakhan',
            image: { uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' },
            time: '9.00 AM'
        },
        {
            id: 3,
            name: 'Lakhan',
            image: { uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' },
            time: '10.00 AM'
        },
        {
            id: 4,
            name: 'Hanuman',
            image: { uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' },
            time: '10.00 AM'
        },
    ];
    const renderItem = (item) => {
        const name = item.item.name ? item.item.name : 'User';
        const image = item.item.image ? item.item.image : { uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' };
        const time = item.item.time ? item.item.time : '9:00 AM';
        return (
            <View style={styles.renderItemMainView}>
                <Image
                    source={image}
                    resizeMode='cover'
                    style={styles.renderImage}
                />
                {/* User  */}
                <View style={{ gap: 5, width: '65%' }} >
                    <View style={styles.newView}>
                        <Text style={styles.newText}>New</Text>
                    </View>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text>{name} Requested to withdraw balance</Text>
                    {/* Button View */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btn}
                        >
                            <Text style={styles.approveText}>Approve</Text>

                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.btn, {
                                backgroundColor: '#FFFFFF',
                                borderColor: '#FF8800'
                            }]}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text>{time}</Text>
                </View>
            </View>
        )
    }
    return (
        <>
            <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />

            <View style={{ flex: 1 }}>
                {
                    isLoading ? <Loader visible={isLoading} /> : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={[styles.scrollViewContent, { paddingBottom: inset.bottom + 50 }]}
                        >
                            <AdminTemplateHeaderPart name={'Approve Withdrawals'} />
                            <View style={styles.dashboardWrapper}>
                                <FlatList
                                    data={withdrawalApproval}
                                    keyExtractor={(item) => item.id.toString()}
                                    scrollEnabled={false}
                                    renderItem={renderItem}
                                    ListEmptyComponent={() => {
                                        <View>
                                            <Text>No withdrawal request found</Text>
                                        </View>
                                    }}

                                />
                                {/* {renderItem} */}
                                {/* <View style={styles.renderItemMainView}>
                                    <Image
                                        source={{ uri: 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg' }}
                                        resizeMode='cover'
                                        style={styles.renderImage}
                                    /> */}
                                {/* User  */}
                                {/* <View
                                        style={{
                                            gap: 5
                                        }}
                                    >
                                        <View style={styles.newView}>
                                            <Text style={styles.newText}>New</Text>
                                        </View>
                                        <Text
                                            style={styles.nameText}
                                        >Aman</Text>
                                        <Text>Aman Requested to withdraw balance</Text> */}
                                {/* Button View */}
                                {/* <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={styles.btn}
                                            >
                                                <Text
                                                    style={styles.approveText}
                                                >Approve</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={[styles.btn, {
                                                    backgroundColor: '#FFFFFF',
                                                    borderColor: '#FF8800'
                                                }]}
                                            >
                                                <Text
                                                    style={styles.cancelText}
                                                >Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View> */}
                                {/* <View>
                                        <Text>9:00 AM</Text>
                                    </View> */}
                                {/* </View> */}
                            </View>
                        </ScrollView>
                    )
                }

            </View>
        </>
    )
}

export default ApproveWithdrawal

const styles = StyleSheet.create({
    scrollViewContent: {
        backgroundColor: '#fff',
        flexGrow: 1,
        // justifyContent:'center',
        // alignItems: 'center'
    },
    dashboardWrapper: {
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        // justifyContent:'center',
        alignItems: 'center',
        width: '100%',
    },
    renderMainView: {
        flexDirection: 'row',
    },
    renderImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        top: 5
    },
    renderName: {
        fontFamily: 'Poppins',
        fontWeight: '600',
        fontSize: 16,
        color: '#000',
        marginLeft: 10
    },
    renderItemMainView: {
        flexDirection: 'row',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: '#0000001A',
        gap: 10,
        padding: 10,
        // alignItems: 'center'
        // justifyContent:'center'

    },
    newView: {

        width: 50,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#0352A09C',
        justifyContent: 'center',
        alignItems: 'center',

    },
    newText: {
        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 13,
        textAlign: 'center',
        color: '#fff'
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
        marginVertical: 10,

    },
    btn: {
        width: 67,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#FF8800',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#FF8800',
    },
    cancelText: {
        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 13,
        textAlign: 'center',
        color: '#FF8800'
    },
    approveText: {

        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 13,
        textAlign: 'center',
        color: '#fff'

    },
    nameText: {
        fontFamily: 'Poppins',
        fontWeight: '900',
        fontSize: 16,
        color: '#2E7D32',


    }

})