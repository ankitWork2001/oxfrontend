import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveInvestments } from '../../redux/slices/investmentSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import { RFValue } from 'react-native-responsive-fontsize';

const planColors = {
  'Basic Plan': '#0077FFD9',
  'Starter Plan': '#00BFA5D9',
  'Ultra Plan': '#8E24AAD9',
  'Gold Plan': '#FDBE00D9',
  'Premium Plan': '#3F51B5D9',
  'Super Plan': '#FF6F00D9',
  'Standard Plan': '#607D8BD9',
};

const OngoingInvestmentsScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { activeInvestments, loading } = useSelector(state => state.investment);

  useEffect(() => {
    dispatch(fetchActiveInvestments());
  }, []);

  const renderOngoingInvestment = ({ item }) => {
    const planName = typeof item.planId === 'object' ? item.planId.name : item.planId || 'N/A';
    const color = planColors[planName] || '#0077FF';
    const invested = item.amount ?? 0;
    const earnings = item.earnings ?? 0;
    const nextPayout = item.nextPayoutDate ? moment(item.nextPayoutDate).format('MMM DD, YYYY') : 'N/A';
    const endDate = item.endDate ? moment(item.endDate).format('MMM DD, YYYY') : 'N/A';
    const start = moment(item.startDate);
    const end = moment(item.endDate);
    const now = moment();
    const progress = Math.min(Math.max(now.diff(start, 'days') / end.diff(start, 'days'), 0), 1);

    return (
      <View style={[styles.ongoingCard, { backgroundColor: color }]}>
        <View style={styles.ongoingTopRow}>
          <Icon name={planName.toLowerCase().includes('gold') ? 'bolt' : 'schedule'} color="#fff" size={18} />
          <Text style={styles.ongoingPlanTitle}>{planName}</Text>
        </View>
        <Text style={styles.progressLabel}>Progress</Text>
        <Slider
          style={{ width: '100%', height: 20 }}
          value={progress}
          minimumValue={0}
          maximumValue={1}
          disabled
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#fff"
        />
        <Text style={styles.ongoingText}>Invested: ${invested}</Text>
        <Text style={styles.ongoingText}>Earnings: ${earnings}</Text>
        <Text style={styles.ongoingText}>Next Payout: {nextPayout}</Text>
        <Text style={styles.ongoingText}>End Date: {endDate}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.title}>My Ongoing Investments</Text>
      <FlatList
        data={activeInvestments}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderOngoingInvestment}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No ongoing investments</Text>}
      />
    </SafeAreaView>
  );
};

export default OngoingInvestmentsScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: RFValue(20),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 15,
  },
  ongoingCard: {
    width: '100%',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    elevation: 3,
  },
  ongoingTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  ongoingPlanTitle: { color: '#fff', fontSize: RFValue(14), fontWeight: '700' },
  progressLabel: { color: '#fff', fontSize: RFValue(10), marginBottom: 4 },
  ongoingText: { fontSize: RFValue(10), color: '#fff', marginBottom: 2 },
});