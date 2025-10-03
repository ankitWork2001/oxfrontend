import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearSelectedPlan,
  updateInvestmentPlan,
  createInvestmentPlan,
  fetchAllInvestmentPlans,
} from '../../redux/slices/adminSlice';

const EditPlanScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedPlan, selectedPlanMode } = useSelector(state => state.admin);
  const color = selectedPlan?.color || '#34A853';
  const isAddMode = selectedPlanMode === 'add';

  const [planName, setPlanName] = useState(selectedPlan?.name || '');
  const [roi, setRoi] = useState(selectedPlan?.roiPercent?.toString() || '');
  const [amount, setAmount] = useState(selectedPlan?.minAmount?.toString() || '');
  const [duration, setDuration] = useState(selectedPlan?.durationDays?.toString() || '');
  const [autoPayout, setAutoPayout] = useState(selectedPlan?.autoPayout ?? false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [oldValues, setOldValues] = useState({
    roi: selectedPlan?.roiPercent || '',
    amount: selectedPlan?.amount || '',
  });

  const handleSave = async () => {
    const payload = {
      name: planName,
      roiPercent: roi,
      minAmount: amount,
      durationDays: duration,
      autoPayout: autoPayout,
    };

    try {
      if (isAddMode) {
        await dispatch(createInvestmentPlan(payload)).unwrap();
      } else {
        const id = selectedPlan && (selectedPlan._id || selectedPlan.id);
        if (!id || id.startsWith('basic') || id.startsWith('Gold') || id.startsWith('Premium')) {
          console.warn('🚨 Invalid or demo plan ID. Update skipped.');
          Alert.alert(
            '❌ Demo Plan',
            'This plan is for display only and cannot be updated. Please add a new one instead.'
          );
          return;
        }

        await dispatch(updateInvestmentPlan({ id, data: payload })).unwrap();
      }

      await dispatch(fetchAllInvestmentPlans());
      setShowSnackbar(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      console.error('Error while saving plan:', error);
      Alert.alert(
        '❌ Failed to Save Plan',
        error?.message || error?.error || 'Something went wrong while saving the plan.'
      );
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedPlan());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AdminTemplateHeaderPart name="Investment Plans Management" paddingBottom={10} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.cardBox, { borderLeftColor: color }]}>
          <View style={[styles.titleBar, { backgroundColor: color }]}>
            <Text style={styles.titleText}>
              {isAddMode ? 'Add New Plan' : `Edit ${selectedPlan?.name}`}
            </Text>
          </View>

          {isAddMode && (
            <>
              <Text style={styles.label}>Plan Name :</Text>
              <TextInput
                style={styles.input}
                value={planName}
                onChangeText={setPlanName}
                placeholder="e.g. Starter Plan"
              />
            </>
          )}

          <Text style={styles.label}>ROI (%) :</Text>
          <TextInput
            style={styles.input}
            value={roi}
            onChangeText={setRoi}
            placeholder="e.g. 15"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Min Amount :</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="e.g. 500"
          />

          <Text style={styles.label}>Duration :</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 3"
            keyboardType="numeric"
          />

          {/* <Text style={styles.label}>Payout :</Text>
          <TextInput
            style={styles.input}
            value={payout}
            onChangeText={setPayout}
            placeholder="e.g. Daily"
          /> */}

          <Text style={styles.label}>Auto Payout :</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAutoPayout(true)}
            >
              <View style={[styles.radioCircle, autoPayout && styles.radioSelected]} />
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAutoPayout(false)}
            >
              <View style={[styles.radioCircle, !autoPayout && styles.radioSelected]} />
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: color }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {isAddMode ? 'Add Plan' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showSnackbar && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>
            {isAddMode ? '✅ Plan added successfully' : '✅ Plan updated successfully'}
          </Text>
        </View>
      )}

      {/* ✅ MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>✔️ Plan updated</Text>
            <Text style={styles.modalSubTitle}>Basic plan changes saved:</Text>

            <View style={styles.modalRow}>
              <Text style={styles.labelLeft}>ROI</Text>
              <Text style={styles.valueRight}>
                {roi}% (From {oldValues?.roi || 'N/A'}%)
              </Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.modalRow}>
              <Text style={styles.labelLeft}>Minimum investment</Text>
              <Text style={styles.valueRight}>${amount || 'N/A'}</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.buttonRightAligned}>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  dispatch(clearSelectedPlan());
                  navigation.goBack();
                }}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditPlanScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  snackbar: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#34A853',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
  },
  snackbarText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#000',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  labelLeft: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34A853',
    flex: 1,
  },
  valueRight: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    textAlign: 'right',
    flex: 1.2,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
  buttonRightAligned: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  okButton: {
    borderWidth: 1,
    borderColor: '#34A853',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  okButtonText: {
    color: '#34A853',
    fontWeight: '700',
    fontSize: 15,
  },
  cardBox: {
    margin: 16,
    padding: 0,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 6,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  titleBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginTop: 20,
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    color: 'black',
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#34A853',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#34A853',
  },
  radioText: {
    fontSize: 15,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
});
