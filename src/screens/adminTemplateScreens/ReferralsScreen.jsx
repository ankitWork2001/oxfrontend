// import { Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
// import React, { useEffect } from 'react'
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { RFValue } from 'react-native-responsive-fontsize';
// import { Clipboard } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import ReferralPageUpparPart from '../../screens/Referral/ReferralScreen/ReferralPageUpparPart';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReferralCode, fetchReferralCommission, fetchReferralTree } from '../../redux/slices/referralSlice';
// import Loader from '../../components/Loader/Loader';
// import { getMyReferralSummary, getReferralBonusHistory } from '../../redux/slices/rewardSlice';
// import moment from 'moment';

// const ReferralScreen = () => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const { height } = Dimensions.get('window');
//   const { referralTree, successMsg, errorMsg, referralCode,  referralLoading, commission } = useSelector(state => state.referral);
//   const { summary, loading: summaryLoading, bonusHistory } = useSelector((state) => state.reward)
//   const dispatch = useDispatch();
//   const isLoading = summaryLoading || referralLoading;
//   // console.log('Commission:', commission);
//   console.log('Referral Tree:', referralTree);
//   // console.log('Bonus History:', bonusHistory);
//   useEffect(() => {
//     dispatch(fetchReferralCode());
//     dispatch(fetchReferralTree());
//     dispatch(fetchReferralCommission());
//     dispatch(getMyReferralSummary())
//     dispatch(getReferralBonusHistory())
//   }, []);
//   // console.log('History', bonusHistory);
//   const renderCommissionItem = ({ item }) => {
//     const commissionPercent = item ? item.commissionPercent : 'N/A'
//     return (
//       <View style={styles.dataRow}>
//         <Text style={styles.cellText}>Level: 1 {item.level}</Text>
//         <Text style={styles.cellText}>{commissionPercent}%</Text>
//       </View>
//     )

//   }
//   return (
//     <SafeAreaView style={styles.MainContainer}>
//       {
//         isLoading ? (
//           <Loader visible={isLoading} />
//         ) : (
//           <>
//             <ScrollView
//               contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 100 }}
//               showsVerticalScrollIndicator={false}
//             >
//               <ReferralPageUpparPart />

//               <Text style={styles.headerText}>Commission Levels</Text>

//               <View style={styles.Tablecontainer}>
//                 <View style={styles.headerRowcontainer}>
//                   <Text style={[styles.TableheaderText, { marginLeft: 20 }]}>Level</Text>
//                   <Text style={styles.TableheaderText}>Commission</Text>
//                 </View>

//                 <FlatList
//                   data={referralTree}
//                   scrollEnabled={false}
//                   // horizontal
//                   keyExtractor={(_, index) => index.toString()}
//                   contentContainerStyle={{ padding: 10 }}
//                   ListEmptyComponent={<Text style={{
//                     textAlign: 'center',
//                     fontSize: RFValue(16),
//                     fontWeight: '400',
//                     marginTop: 10
//                   }}>No referrals yet.</Text>}
//                   renderItem={renderCommissionItem}
//                 />
//                 <View style={styles.showDetailsButtonContainer}>
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('ReferralDetails')}
//                     style={styles.showDetailsButton}
//                   >
//                     <Text style={styles.showDetailsButtonText}>Show Details</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               {/* Summary */}
//               <Text style={[styles.headerText, { marginTop: 40 }]}>Your Team</Text>
//               <View style={styles.yourTeamContianer}>
//                 <View style={[styles.teamBox, { backgroundColor: '#FDBE00' }]}>
//                   <Text style={styles.teamBoxText}>Total Refferrals</Text>
//                   <Text style={styles.teamBoxNumber}>{summary ? summary.totalReferrals : '0'}</Text>
//                 </View>
//                 <View style={[styles.teamBox, { backgroundColor: '#10B981' }]}>
//                   <Text style={styles.teamBoxText}>Earnings</Text>
//                   <Text style={styles.teamBoxNumber}>${summary ? summary.earnings : '0'}</Text>
//                 </View>
//                 <View style={[styles.teamBox, { backgroundColor: '#FF8632' }]}>
//                   <Text style={styles.teamBoxText}>Active Investors</Text>
//                   <Text style={styles.teamBoxNumber}>{summary ? summary.activeInvestors : '0'}</Text>
//                 </View>
//               </View>

//               <Text style={[styles.headerText, { marginTop: 30 }]}>Bonus History</Text>

//               <View style={styles.Tablecontainer}>
//                 <View style={styles.headerRowcontainer}>
//                   <Text style={styles.TableheaderText}>Date</Text>
//                   <Text style={styles.TableheaderText}>Amount</Text>
//                   <Text style={styles.TableheaderText}>Level</Text>
//                 </View>

//                 {
//                   bonusHistory && !bonusHistory.length <= 0 ? bonusHistory.slice(0, 3).map((item, index) => (
//                     <View
//                       key={index}
//                       style={[styles.dataRow, { backgroundColor: '#84D299' }]}>
//                       <Text style={[styles.cellText, { color: '#fff' }]}>{item ? moment(item.date).format('D MMM YYYY') : "N/A"}</Text>
//                       <Text style={[styles.cellText, { color: '#fff' }]}>{item ? item.amount.toLocaleString('en-US', {
//                         style: 'currency',
//                         currency: 'USD',
//                       }) : 'N/A'}</Text>
//                       <Text style={[styles.cellText, { color: '#fff' }]}>1</Text>
//                     </View>
//                   ))
//                     : (
//                       <Text style={{
//                         textAlign: 'center',
//                         fontSize: RFValue(16),
//                         fontWeight: '400',
//                         marginVertical: 10
//                       }}>No referrals yet.</Text>
//                     )
//                 }
//               </View>
//             </ScrollView>
//           </>
//         )
//       }

//     </SafeAreaView>
//   )
// }

// export default ReferralScreen

// const styles = StyleSheet.create({
//   MainContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   headerText: {
//     fontSize: RFValue(20),
//     fontWeight: 'normal',
//     margin: 20
//   },
//   Tablecontainer: {
//     borderRadius: 4,
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     marginVertical: 10,
//     elevation: 3,
//   },
//   headerRowcontainer: {
//     flexDirection: 'row',
//     backgroundColor: '#34A853',
//     padding: 10,
//     borderTopLeftRadius: 6,
//     borderTopRightRadius: 6,


//   },
//   TableheaderText: {
//     flex: 1,
//     color: '#fff',
//     fontWeight: '700',
//     // textAlign: 'center',
//     fontSize: RFValue(12),


//   },
//   dataRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     gap: 10,

//   },
//   cellText: {
//     flex: 1,
//     textAlign: 'left',
//     fontWeight: '600',
//   },
//   showDetailsButtonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   showDetailsButton: {
//     backgroundColor: '#FF8800',
//     width: '90%',
//     paddingVertical: 8,
//     borderRadius: 5,
//     marginVertical: 10
//   },
//   showDetailsButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: RFValue(14),
//     fontWeight: "500"
//   },
//   yourTeamContianer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around'
//   },
//   teamBox: {
//     width: 95,
//     height: 62,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: "center"
//   },
//   teamBoxText: {
//     color: '#fff',
//     fontSize: RFValue(10),
//   },
//   teamBoxNumber: {
//     color: '#fff',
//     fontSize: RFValue(14),
//   },
// })