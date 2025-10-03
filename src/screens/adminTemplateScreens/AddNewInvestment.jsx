import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AddNewInvestment = () => {
  const inset = useSafeAreaInsets();
  return (
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: inset.bottom + 50 }]}
        >
          <AdminTemplateHeaderPart name={'Add New Investments'} />
          <View style={styles.dashboardWrapper}>
            {/* You can also place AutoPayout radio here if required in AddNew screen */}
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default AddNewInvestment

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  dashboardWrapper: {
    marginTop: 20,
  },
})
