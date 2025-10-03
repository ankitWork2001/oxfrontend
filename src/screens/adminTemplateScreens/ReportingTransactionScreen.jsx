import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart'
import Loader from '../../components/Loader/Loader'

const ReportingTransactionScreen = () => {
const loading = false; // Replace with actual loading state
  return (
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
      {
        loading ? (
          <Loader visible={loading} />
        ) : (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>
              <AdminTemplateHeaderPart name='Reporting and Transactions' paddingBottom={20} />
              <View style={styles.container}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.HorizentalScrollContainer}
                >
                  {/* <View style={styles.TableContainer}>
                    <View style={[styles.row, styles.headerRow]}>
                      <Text style={[styles.headerCell, { width: columnWidths.userId }]}>User ID</Text>
                      <Text style={[styles.headerCell, { width: columnWidths.planName }]}>Plan Name</Text>
                      <Text style={[styles.headerCell, { width: columnWidths.amount }]}>Amount</Text>
                      <Text style={[styles.headerCell, { width: columnWidths.roi }]}>R.O.I</Text>
                      <Text style={[styles.headerCell, { width: columnWidths.status }]}>Status</Text>
                      <Text style={[styles.headerCell, { width: columnWidths.date }]}>Dates</Text>
                    </View>

                    {userInvestments.map((item, index) => (
                      <View style={styles.row} key={index}>
                        <Text style={[styles.cell, { width: columnWidths.userId }]}>{item ? item._id : 'N/A'}</Text>
                        <Text style={[styles.cell, { width: columnWidths.planName }]}>{item ? item.planId.name : 'N/A'}</Text>
                        <Text style={[styles.cell, { width: columnWidths.amount }]}>${item ? item.amount : 'N/A'}</Text>
                        <Text style={[styles.cell, { width: columnWidths.roi }]}>{item ? item.planId.roiPercent : 'N/A'}</Text>
                        <Text style={[styles.cell, { width: columnWidths.status }]}>{item ? item.status?.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}</Text>
                        <Text style={[styles.cell, { width: columnWidths.date }]}>{item ? moment(item.startDate).format('MMM DD, YYYY') : 'N/A'}</Text>
                      </View>
                    ))}
                  </View> */}
                </ScrollView>
              </View>
            </ScrollView>
          </SafeAreaView>
        )
      }

    </>
  )
}

export default ReportingTransactionScreen

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F3F3F3",
    margin: 10,
    borderRadius: 6
  },
})