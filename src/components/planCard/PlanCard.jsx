import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PlanCard = ({
  title,
  logo,
  image,
  roi,
  amount,
  duration,
  payout,
  editable = false,
  borderColor = '#999',
  editButtonColor = '#34A853',
  editButtonText = 'Edit',
  onEditPress,
  onDeletePress, // ✅
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      {/* Title with logo */}
      <View style={styles.titleRow}>
        {logo && <Image source={logo} style={styles.logo} resizeMode="contain" />}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Content + Right Side Image */}
      <View style={styles.topSection}>
        <View style={styles.leftContent}>
          <LabelValue label="ROI:" value={roi} editable={editable} />
          <LabelValue label="Min Amount:" value={`${amount}`} editable={editable} />
          <LabelValue label="Duration:" value={duration} editable={editable} />
          <LabelValue label="Payout:" value={payout} editable={editable} />
        </View>

        {image && (
          <Image
            source={image}
            style={styles.planimage}
            resizeMode="contain"
          />
        )}
      </View>

      {/* ✅ Edit and Delete Buttons Side-by-Side */}
      {!editable && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: editButtonColor }]}
            onPress={onEditPress}
          >
            <Text style={styles.editText}>{editButtonText}</Text>
          </TouchableOpacity>

          {onDeletePress && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDeletePress}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const LabelValue = ({ label, value, editable }) => (
  <View style={styles.row}>
    {editable ? (
      <>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          defaultValue={value}
          placeholderTextColor="#999"
          style={styles.inputInline}
        />
      </>
    ) : (
      <Text style={styles.labelValueText}>
        {label} <Text style={styles.value}>{value}</Text>
      </Text>
    )}
  </View>
);

export default PlanCard;

const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 6,
    borderLeftWidth: 6,
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 1,
    marginBottom: 30,
    marginHorizontal: '5%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  planimage: {
    width: 150,
    height: 130,
    borderRadius: 8,
  },
  row: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '400',
    color: '#50555C',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    color: '#111',
  },
  labelValueText: {
    fontSize: 14,
    color: '#111',
    marginBottom: 4,
  },
  inputInline: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    paddingVertical: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
