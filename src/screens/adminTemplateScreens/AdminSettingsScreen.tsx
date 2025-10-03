import { Dimensions, StatusBar, StyleSheet, Text, View, ScrollView, SafeAreaView, } from 'react-native'
import React from 'react'
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AdminSettingsScreen = () => {
  const inset = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  return (
    // <View>
    //   <AdminTemplateHeaderPart name='SettingsScreen' paddingBottom={20} />
    //   <Text>SettingsScreen</Text>
    // </View>
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
      <SafeAreaView style={styles.mainView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: inset.bottom + 50 }]}
        >
          <AdminTemplateHeaderPart name='SettingsScreen' paddingBottom={20}/>
          <Text style={styles.SettingsText}>Admin Settings Screen</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default AdminSettingsScreen

const styles = StyleSheet.create({
  mainView: {
    flex: 1,

  },
  scrollViewContent: {
    backgroundColor: '#fff',
  },
  SettingsText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})