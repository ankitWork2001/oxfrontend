import React, { useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferralSummary, fetchSubReferrals } from '../../../redux/slices/referralSlice';
import { RootState, AppDispatch } from '../../../redux/store';
import moment from 'moment';
import Loader from '../../../components/Loader/Loader';

type ReferralItem = {
  referredUser?: {
    name?: string;
    username?: string;
    email?: string;
    createdAt?: string;
  };
  createdAt?: string;
  isCommissionGiven?: boolean;
  level?: number;
};

const ReferralDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  const { allSubReferrals, summary, referralLoading, errorMsg } = useSelector(
    (state: RootState) => state.referral
  );

  useEffect(() => {
    dispatch(fetchReferralSummary());
  }, [dispatch]);


  const renderItem = ({ item }: { item: any }) => (
  <View>
    {/* Parent Referral Row */}
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        if (expandedRow === item.referredUser?._id) {
          setExpandedRow(null); // collapse
        } else {
          setExpandedRow(item.referredUser?._id); // expand
          if (item.referredUser?._id) {
            dispatch(fetchSubReferrals(item.referredUser._id));
          }
        }
      }}
    >
      {/* <Text style={styles.cell}>{item.referredUser?._id || 'N/A'}</Text> */}
      <Text style={styles.cell}>{item.referredUser?.name || 'N/A'}</Text>
      <Text style={styles.cell}>
        {item.createdAt ? moment(item.createdAt).format('DD MMM YYYY') : 'N/A'}
      </Text>
      <Text
        style={[
          styles.cell,
          { color: item.isCommissionGiven ? '#10B981' : '#EF4444' },
        ]}
      >
        {item.isCommissionGiven ? '✅ Yes' : '❌ No'}
      </Text>
    </TouchableOpacity>

    {/* Sub-referrals (only if expanded) */}
    {expandedRow === item.referredUser?._id && allSubReferrals?.length > 0 && (
      <View style={styles.subReferralContainer}>
        {allSubReferrals.map((sub: any) => (
          <View key={sub._id} style={styles.subRow}>
            <Text style={styles.subCell}>{sub.username || 'N/A'}</Text>
            <Text style={styles.subCell}>
              {sub.createdAt
                ? moment(sub.createdAt).format('DD MMM YYYY')
                : 'N/A'}
            </Text>
            <Text
              style={[
                styles.subCell,
                { color: sub.commissionAmount > 0 ? '#10B981' : '#EF4444' },
              ]}
            >
              {sub.commissionAmount > 0 ? '✅ Yes' : '❌ No'}
            </Text>
          </View>
        ))}
      </View>
    )}
  </View>
);


  return (
    <SafeAreaView style={styles.MainContainer}>
      <View style={styles.headerContentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Referral Details</Text>
      </View>

      {referralLoading ? (
        <Loader visible />
      ) : (
        <View style={styles.tabsMainContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Joined On</Text>
            <Text style={styles.headerCell}>Commission</Text>
          </View>

          <FlatList
            data={summary?.referrals as ReferralItem[]}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No referrals available.</Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ReferralDetailsScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34A853',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: RFValue(18),
    fontWeight: '500',
    color: '#fff',
    marginLeft: 10,
  },
  tabsMainContainer: {
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: RFValue(12),
    color: '#000',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,
    fontSize: RFValue(13),
    color: '#000',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  subReferralContainer: {
  backgroundColor: '#f9f9f9',
  paddingLeft: 20,
},
subRow: {
  flexDirection: 'row',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderColor: '#eee',
},
subCell: {
  flex: 1,
  fontSize: RFValue(12),
  color: '#333',
  textAlign: 'center',
},

});
