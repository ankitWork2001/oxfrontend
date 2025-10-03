import React, { useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { RFValue } from 'react-native-responsive-fontsize'
import { TextInput } from 'react-native-gesture-handler'
import AdminTemplateHeaderPart from '../../components/Header/AdminTemplateHeaderPart'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpinLogs } from '../../redux/slices/adminSlice'
import Loader from '../../components/Loader/Loader'

// const spinLogs = [
//   { date: '1/2/25', userId: 'UU01', result: 'Win', amount: 'Rs.200' },
//   { date: '1/2/25', userId: 'UU01', result: 'Win', amount: 'Rs.300' },
//   { date: '1/2/25', userId: 'UU01', result: 'Win', amount: 'Rs.200' },
//   { date: '1/2/25', userId: 'UU01', result: 'Win', amount: 'Rs.400' },
// ]

const columnWidths = {
  date: 100,
  userId: 100,
  result: 100,
  amount: 120,
}

const SpinLogsScreen = () => {
  const dispatch = useDispatch();
  const { spins, loading } = useSelector((state) => state.admin);
  // console.log('Spin Logs:', spins);
  useEffect(() => {
    dispatch(fetchSpinLogs());
  }, [dispatch]);
  return (
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
      {
        loading ? (<Loader visible={loading} />)
          : (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

              <ScrollView>
                <AdminTemplateHeaderPart name='Spin Logs' paddingBottom={20} />
                <View style={styles.container}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.HorizentalScrollContainer}
                  >
                    <View style={styles.TableContainer}>
                      <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.headerCell, { width: columnWidths.date }]}>Dates</Text>
                        <Text style={[styles.headerCell, { width: columnWidths.userId }]}>User ID</Text>
                        <Text style={[styles.headerCell, { width: columnWidths.userId }]}>User Name</Text>
                        <Text style={[styles.headerCell, { width: columnWidths.result }]}>Spin Result</Text>
                        <Text style={[styles.headerCell, { width: columnWidths.amount }]}>Amount Credited</Text>
                      </View>
                      {spins.map((item, index) => (
                        <View style={styles.row} key={item._id}>
                          <Text style={[styles.cell, { width: columnWidths.date }]}> {new Date(item.createdAt).toLocaleDateString('en-GB')}</Text>
                          <Text style={[styles.cell, { width: columnWidths.userId }]}>{item._id || 'N/A'}</Text>
                          <Text style={[styles.cell, { width: columnWidths.userId }]}>{item.userId?.name || 'N/A'}</Text>
                          <Text style={[styles.cell, { width: columnWidths.result }]}> {item.userId?._id}</Text>
                          <Text style={[styles.cell, { width: columnWidths.amount }]}> ${item.resultValue}</Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </ScrollView>
            </SafeAreaView>
          )
      }

    </>
  )
}

export default SpinLogsScreen

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F3F3F3",
    margin: 10,
    borderRadius: 6
  },

  HorizentalScrollContainer: {
    backgroundColor: '#fff',
  },
  TableContainer: {

  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#4CAF50',
  },
  headerCell: {
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 10,
  },
  cell: {
    paddingHorizontal: 10,
  },
  link: {
    color: 'blue',
    marginRight: 10,
    textDecorationLine: 'underline'
  },
  reject: {
    color: 'red',
    textDecorationLine: 'underline'
  },
})