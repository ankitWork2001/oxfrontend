import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, { useCallback } from 'react';
import Loader from '../../components/Loader/Loader';
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  fetchAllInvestmentPlans,
  setSelectedPlan,
  deleteInvestmentPlan,
} from '../../redux/slices/adminSlice';
import PlanCard from '../../components/planCard/PlanCard';

const InvestmentPlans = () => {
  const { investmentPlans, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAllInvestmentPlans());
    }, [dispatch])
  );

  const handleEdit = (plan, color, mode = 'edit') => {
    dispatch(
      setSelectedPlan({
        plan: {
          _id: plan._id,
          name: plan.name || plan.title || '',
          roiPercent: plan.roiPercent || plan.roi || '',
          minAmount: plan.minAmount || plan.amount || '',
          durationDays: plan.durationDays || plan.duration || '',
          autoPayout: plan.autoPayout ?? false,
          color,
        },
        mode,
      })
    );
    navigation.navigate('EditPlan');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Plan?',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            (async () => {
              try {
                await dispatch(deleteInvestmentPlan(id));
                dispatch(fetchAllInvestmentPlans());
              } catch (error) {
                console.error('Delete failed:', error);
              }
            })();
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <Loader visible={loading} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <AdminTemplateHeaderPart
              name="Investment Plans Management"
              paddingBottom={10}
            />

            <View style={styles.container}>
              <View style={styles.cardList}>
                {/* ✅ Dynamic Plans from API */}
                {investmentPlans?.map((plan, index) => {
                  const dynamicColor = '#666';

                  return (
                    <PlanCard
                      key={`dynamic-${plan._id || index}`}
                      title={plan?.name || 'N/A'}
                      roi={`${plan?.roiPercent || 'N/A'}%`}
                      amount={`$${plan?.minAmount || 'N/A'}`}
                      duration={`${plan?.durationDays || 'N/A'} days`}
                      payout={plan?.autoPayout ? 'Yes' : 'No'}
                      borderColor={dynamicColor}
                      editButtonColor={dynamicColor}
                      onEditPress={() => handleEdit(plan, dynamicColor)}
                      onDeletePress={() => handleDelete(plan._id)}
                    />
                  );
                })}

                {/* ✅ Add New Plan Button */}
                <PlanCard
                  key="add-new-plan"
                  title={'New Plan'}
                  roi={''}
                  amount={''}
                  duration={''}
                  payout={''}
                  borderColor="#978686"
                  editButtonColor="#978686"
                  editButtonText="Add Plan"
                  onEditPress={() =>
                    handleEdit(
                      {
                        title: 'New Plan',
                        roi: '',
                        minAmount: '',
                        duration: '',
                        autoPayout: false,
                      },
                      '#978686',
                      'add'
                    )
                  }
                />
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default InvestmentPlans;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  cardList: {
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: 10,
  },
});
