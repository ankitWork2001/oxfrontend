import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Loader from '../../components/Loader/Loader';
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { fetchUserById } from '../../redux/slices/adminSlice';

const UserDetailsScreen = () => {
  const inset = useSafeAreaInsets();
  const route = useRoute();
  const dispatch = useDispatch();
  const { singleUser, singleUserLoading } = useSelector((state) => state.admin);

    const { userId } = route.params || {};

   useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  console.log("Single User Data:", singleUser);

  return (
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
      {
        singleUserLoading ? <Loader visible={singleUserLoading} /> : (
          <View style={{ flex: 1 }}>
            <AdminTemplateHeaderPart name={"User Investments"} paddingBottom={20} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.scrollViewContent, { paddingBottom: inset.bottom + 50 }]}
            >
              {/* User Details */}
              <View style={styles.dashboardWrapper}>
                <View style={styles.userDetailsView1}>
                  <Image
                    source={{ uri: singleUser?.user?.avatarUrl ? singleUser?.user?.avatarUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBwdXILD8UEHD_k8M2d-fvNLi9yBMMO3KXQ&s' }}
                    style={styles.imageStyle}
                    resizeMode='cover'
                  />
                  <Text style={styles.useridText}>User Id : {singleUser?.user?._id || 'N/A'}</Text>
                  <View style={styles.walletView}>
                    <Text style={styles.walletbalenceText}>Wallet Balance</Text>
                    <Text style={styles.walletbalenceText}>${singleUser?.wallet?.balance || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.userDetailsView2}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.labelDetails}>
                    <Text style={styles.nameText}>{singleUser?.user?.name || 'N/A'}</Text>
                  </View>

                  <Text style={styles.label}>E-Mail</Text>
                  <View style={styles.labelDetails}>
                    <Text style={styles.nameText}>{singleUser?.user?.email || 'N/A'}</Text>
                  </View>

                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.labelDetails}>
                    <Text style={styles.nameText}>{singleUser?.user?.mobile || 'N/A'}</Text>
                  </View>

                  <Text style={styles.label}>Referral Code</Text>
                  <View style={styles.labelDetails}>
                    <Text style={styles.nameText}>{singleUser?.user?.code || 'N/A'}</Text>
                  </View>
                </View>

                {/* Investment Plans Section */}
                {
                  singleUser?.investments?.length > 0 ? (
                    <View style={{ paddingHorizontal: 10 }}>
                      <Text style={styles.sectionTitle}>Investment Plans</Text>
                      {
                        singleUser.investments.map((inv, index) => (
                          <View key={inv._id || index} style={styles.investmentCard}>
                            <Text style={styles.label}>Plan Name: <Text style={styles.nameText}>{inv.planId?.name || 'N/A'}</Text></Text>
                            <Text style={styles.label}>ROI: <Text style={styles.nameText}>{inv.planId?.roiPercent || 'N/A'}%</Text></Text>
                            <Text style={styles.label}>Amount: <Text style={styles.nameText}>${inv.planId?.amount || 'N/A'}</Text></Text>
                            <Text style={styles.label}>Status: <Text style={styles.nameText}>{inv.status || 'N/A'}</Text></Text>
                            <Text style={styles.label}>Start Date: <Text style={styles.nameText}>{new Date(inv.startDate).toDateString()}</Text></Text>
                          </View>
                        ))
                      }
                    </View>
                  ) : (
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
                      No Investments Found.
                    </Text>
                  )
                }

              </View>
            </ScrollView>
          </View>
        )
      }
    </>
  )
}

export default UserDetailsScreen

const styles = StyleSheet.create({
  scrollViewContent: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  dashboardWrapper: {
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    width: '100%',
    flex: 1
  },
  userDetailsView1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    width: '90%',
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  useridText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    width: '30%',
  },
  walletView: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FF8800',
    marginLeft: 10,
    height: RFValue(45),
    elevation: 2,
  },
  walletbalenceText: {
    fontSize: RFValue(12),
    color: '#fff',
    fontWeight: '500',
  },
  userDetailsView2: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '100%',
    gap: 10,
  },
  label: {
    fontSize: RFValue(14),
    color: '#8F8F8F',
    fontWeight: '400',
    marginBottom: 5,
  },
  nameText: {
    fontSize: RFValue(14),
    color: '#000',
    fontWeight: '400',
  },
  labelDetails: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#00000061',
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#000',
    marginVertical: 10,
  },
  investmentCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
});
