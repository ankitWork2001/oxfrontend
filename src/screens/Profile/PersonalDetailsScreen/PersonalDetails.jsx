import { ActivityIndicator, Alert, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { getEmployeeById, updateUser } from '../../../redux/slices/userSlice';
import { API_BASE_URL } from '../../../api/axiosInstance';

const PersonalDetails = () => {
    const inputRef = useRef(null);
    const { height, width } = Dimensions.get('window');
    const { userDetails, wallet, loading } = useSelector((state) => state.user);
    // const [userId, setUserId] = useState();
    const [fullName, setFullName] = useState(userDetails?.name || 'User');
    const [userName, setUserName] = useState(userDetails?.username || 'Username');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState(userDetails?.email || 'Not Provided');
    const [mobileNumber, setMobile] = useState(userDetails.mobile || 'Not Provided');
    const [referralCode, setReferralCode] = useState(userDetails.code || 'Not Provided');
    const [accountVerified, setAccountVerified] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { userId } = useSelector((state) => state.auth);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const copyToClipboardReferralCode = (item) => {
        Clipboard.setString(item);
        Alert.alert('Copied to Clipboard', `Referral Code: ${item}`);
    };
    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (!editMode) {
            // If entering edit mode, focus on the full name input
            focusInput();
        }
    }
    const updateData = {
        name: fullName,
        email,
        mobile: mobileNumber,

    }
    const handleUpdateUser = async () => {
        try {
            await dispatch(updateUser(updateData));
            Alert.alert('Success', 'User details updated successfully');
            dispatch(getEmployeeById(userId)); // Refresh user details

            setEditMode(false);

        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update user details');
        }
    }
    return (
        <SafeAreaView style={styles.MainContainer}>
            <ScrollView 
            showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTextContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={20} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Personal Details</Text>
                    </View>
                    <View style={styles.IconSubContainer}>
                        <TouchableOpacity
                            onPress={handleEditToggle}
                        >
                            {
                                editMode ? (
                                    <Icon name="close" size={24} color="#fff" />
                                ) : (
                                    <Icon name="edit" size={24} color="#fff" />
                                )
                            }

                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="settings" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.profileImageAndTextContainer}>
                    <Image
                        source={{
                            uri: userDetails.avatarUrl
                                ? userDetails.avatarUrl
                                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBwdXILD8UEHD_k8M2d-fvNLi9yBMMO3KXQ&s',
                            resizeMode: 'cover',
                        }}
                        style={styles.Image}

                    />
                    <TouchableOpacity
                        style={[styles.cameraIcon, { right: width * 0.06, top: height * 0.08 }]}
                    >
                        <Icon name="add-a-photo" size={14} />
                    </TouchableOpacity>
                    <View>
                        {/* <Text style={styles.UserIdText}>UserID : {}</Text> */}
                        <Text style={styles.IdText}>User Id:{userId ? userId : "N/A"}</Text>


                    </View>
                </View>
                <View style={styles.inputsMainContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input}
                        ref={inputRef}
                        value={fullName}
                        editable={editMode}
                        onChangeText={(text) => setFullName(text)}

                    />

                    <Text style={styles.label}>Date Of Birth</Text>
                    <View style={styles.dateInput}>
                        <Text style={styles.dateText}>13 May , 2000</Text>
                        <Icon name="calendar-today" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity style={[styles.genderButton, styles.genderSelected]}>
                            <Text style={[styles.genderText, styles.selectedText]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.genderButton}>
                            <Text style={styles.genderText}>Female</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>E-Mail</Text>
                    <TextInput style={styles.input}
                        value={email}
                        editable={editMode}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType='email-address'
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput style={styles.input}
                        value={mobileNumber}
                        editable={editMode}
                        onChangeText={(text) => setMobile(text)}
                        keyboardType='phone-pad'
                        maxLength={10}

                    />

                    <Text style={styles.label}>Referral Code</Text>
                    <View style={styles.referralContainer}>
                        <TextInput style={styles.referralInput} value={referralCode} editable={false} />
                        <TouchableOpacity
                            onPress={() => copyToClipboardReferralCode(referralCode)}
                            style={styles.copyButton}>
                            <Text style={styles.copyText}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        editMode ? (
                            <TouchableOpacity
                                onPress={handleUpdateUser}
                                style={styles.verifiedButton}>
                                <Text style={styles.verifiedText}>{loading ? (<ActivityIndicator size={'small'} color={'#fff'} />) : ('Update User')}</Text>
                                {/* <Icon name="check-circle" size={36} color="#FF9800" /> */}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.verifiedButton}>
                                <Text style={styles.verifiedText}>Account Verified</Text>
                                <Icon name="check-circle" size={20} color="#FF9800" />
                            </TouchableOpacity>
                        )
                    }
                    <View style={styles.checkIconContainer}>
                        {/* <Icon name="check-circle" size={36} color="#FF9800" /> */}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default PersonalDetails;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#34A853',
        paddingHorizontal: 20, 
        paddingTop: 60,
        paddingBottom: 30,
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
    IconSubContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    profileImageAndTextContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 25,
    },
    Image: {

        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#000',
        overflow: 'hidden',
    },
    cameraIcon: {
        backgroundColor: '#FFFFFF',
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderRadius: 50,
    },
    UserIdText: {
        fontSize: RFValue(12),
        fontWeight: '500',
        color: '#8F8F8F',
        marginTop: 10,
    },
    IdText: {
        fontSize: RFValue(10),
        fontWeight: '500',
        color: '#000',
    },
    inputsMainContainer: {
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        color: '#000',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        color: '#000',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    genderButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    genderSelected: {
        backgroundColor: '#3D5AFE',
        borderColor: '#3D5AFE',
    },
    genderText: {
        color: '#000',
    },
    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
    referralContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    referralInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        color: '#000',
    },
    copyButton: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
    },
    copyText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    verifiedButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 6,
        marginTop: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "center",
        gap: 10,
        height: 50,
    },
    verifiedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkIconContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
