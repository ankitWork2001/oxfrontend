import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getEmployeeById, getTodayEarnings} from '../../redux/slices/userSlice';
import Loader from '../../components/Loader';
import {fetchUserDashboardSummary} from '../../redux/slices/userSlice'; // adjust path

interface ImageItem {
  id: string;
  uri: any;
}
const images: ImageItem[] = [
  {id: '1', uri: require('../../assests/HomepageIMageScroller1.png')},
  {id: '2', uri: require('../../assests/HomepageIMageScroller2.png')},
  {id: '3', uri: require('../../assests/HomepageIMageScroller3.png')},
  {id: '4', uri: require('../../assests/HomepageIMageScroller4.png')},
];

const HomeScreen: React.FC = () => {
  const {height, width} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {userDetails, loading} = useSelector((state: any) => state.user);
  const {todayEarnings} = useSelector((state: any) => state.user);
  const dashboardSummary = useSelector(
    (state: any) => state.user.dashboardSummary?.data,
  );

  const {userId} = useSelector((state: any) => state.auth);
  // console.log('User Detail in Home Page',userDetails);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current && images.length > 0) {
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        flatListRef.current.scrollToIndex({index: nextIndex, animated: true});
      }
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (isFocused && userId) {
      dispatch(getEmployeeById(userId));
      dispatch(fetchUserDashboardSummary());
      dispatch(getTodayEarnings());
    }
  }, [isFocused, userId, dispatch]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      {loading && <Loader />}
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <View>
            {/* Header */}
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.welcomeText}>
                  Welcome, {userDetails ? userDetails.name : 'Guest'}
                </Text>
                <Text style={styles.subText}>Get Ready To Spin</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                // onPress={() => navigation.navigate('NotificationScreen')}
                style={styles.notificationIcon}>
                <Icon name="notifications" size={20} color="#FF8800" />
              </TouchableOpacity>
            </View>

            {/* Image Carousel */}
            <View style={styles.imageMainContainer}>
              <FlatList
                ref={flatListRef}
                data={images}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={Dimensions.get('window').width * 0.8 + 65}
                snapToAlignment="start"
                decelerationRate="fast"
                pagingEnabled
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                  const slide = Math.round(
                    event.nativeEvent.contentOffset.x /
                      (Dimensions.get('window').width * 0.9 + 20),
                  );
                  setCurrentIndex(slide);
                }}
                scrollEventThrottle={16}
                contentContainerStyle={{
                  paddingHorizontal: Dimensions.get('window').width * 0.04,
                }}
                renderItem={({item}) => (
                  <Pressable style={styles.imageContainer}>
                    <Image source={item.uri} style={styles.image} />
                  </Pressable>
                )}
              />
              <View style={styles.dotContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Action Icons */}
            <View style={styles.IconMainContaineer}>
              <TouchableOpacity
                style={styles.IconContaineer}
                onPress={() => navigation.navigate('UserDeposit')} // ✅ DEPOSIT screen
              >
                <Icon name="upload" size={26} color="#FFFFFF" />
                <Text style={styles.IconText}>DEPOSIT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('UserWithdraw')}
                style={styles.IconContaineer}>
                <Icon name="download" size={26} color="#FFFFFF" />
                <Text style={styles.IconText}>WITHDRAW</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Spin')}
                style={styles.IconContaineer}>
                <Icon name="radar" size={26} color="#FFFFFF" />
                <Text style={styles.IconText}>SPIN NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.label}>Today's Earnings</Text>
                <Text style={[styles.value, {color: '#007BFF'}]}>
                  ${todayEarnings || '0'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.label}>Balance</Text>
                <Text style={[styles.value, {color: '#fbc02d'}]}>
                  ${userDetails ? userDetails?.wallet?.balance : '0'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.label}>Frozen Amount</Text>
                <Text style={[styles.value, {color: 'red'}]}>
                  ${userDetails?.wallet?.lockedBalance ?? '0'}
                </Text>
              </View>
            </View>

            {/* Recent Activity */}
            {/* Recent Activity */}
            <Text style={styles.recentTitle}>Recent Activity</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 15, marginBottom: 20}}>
              <View style={styles.recentContainer}>
                {(dashboardSummary?.recentTransactions || [])
                  .slice(0, 4)
                  .map((txn, index) => (
                    <View style={styles.recentCard} key={txn._id || index}>
                      <View style={styles.activityTextContainer}>
                        <Text style={styles.recentText}>
                          {txn.type}
                          {'\n'}${txn.amount}
                        </Text>
                        <Text style={styles.recentTime}>
                          {new Date(txn.createdAt).toLocaleTimeString()}
                        </Text>
                      </View>
                      <View style={styles.recentContainerImageContainer}>
                        <Image
                          source={
                            txn.type === 'bonus'
                              ? require('../../assests/homepageSipnAndWinImage.png')
                              : txn.type.toLowerCase().includes('spin')
                              ? require('../../assests/homepageSipnAndWinImage.png')
                              : txn.type.toLowerCase().includes('deposit')
                              ? require('../../assests/homepageDepositedImage.png')
                              : require('../../assests/homepageWithdrawImage.png')
                          }
                          resizeMode="contain"
                          style={styles.recentContainerImage}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>

            {/* Today Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>

            <View style={styles.todayCard}>
              <View style={styles.todayRow}>
                <Icon name="radar" size={30} color="red" />
                <View>
                  <Text style={styles.todayLabel}>Latest Spin Reward</Text>
                  <Text>$500</Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.todayRow}>
                <Icon name="attach-money" size={30} color="skyblue" />
                <View>
                  <Text style={styles.todayLabel}>Active Investment</Text>
                  <Text>Gold Plan | 2.5% Daily | Active</Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.todayRow}>
                <Icon name="schedule" size={30} color="lightgreen" />
                <View>
                  <Text style={styles.todayLabel}>Next Payout</Text>
                  <Text>12:45:30</Text>
                </View>
              </View>
            </View>

            {/* Play and Win Gift Hampers */}
            <Text style={styles.recentTitle}>Play and Win Gift Hampers</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.horizontalScrollContainer, {flex: 1}]}>
              <View style={styles.card}>
                <Image
                  source={require('../../assests/homepageBigWinImage.png')}
                  style={styles.cardImage}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('SpinScreen')}
                  activeOpacity={0.8}
                  style={[styles.playButton]}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.card}>
                <Image
                  source={require('../../assests/homepageGirlScrollImage.png')}
                  style={styles.cardImage}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('SpinScreen')}
                  activeOpacity={0.8}
                  style={[styles.playButton]}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.card}>
                <Image
                  source={require('../../assests/homepageLuckySpinImage.png')}
                  style={styles.cardImage}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('SpinScreen')}
                  activeOpacity={0.8}
                  style={[styles.playButton]}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  headerContent: {
    backgroundColor: '#34A853',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 60,
  },
  welcomeText: {
    color: '#fff',
    fontSize: RFValue(20),
    fontWeight: '500',
  },
  subText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 400,
  },
  notificationIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 4,
  },
  imageMainContainer: {
    marginVertical: 20,
  },
  imageContainer: {
    marginHorizontal: 10,
    height: 180,
    width: Dimensions.get('window').width * 0.9,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    // marginLeft: 1,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#34A853',
    width: 11,
    height: 11,
    borderRadius: 20,
  },
  IconMainContaineer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  IconContaineer: {
    backgroundColor: '#FF8800',
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    width: 70,
    height: 65,
    gap: 5,
  },
  IconText: {
    color: '#fff',
    fontSize: RFValue(6),
    fontWeight: '400',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  seeAll: {
    color: 'green',
    fontWeight: '500',
  },
  todayCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  todayRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  todayLabel: {
    fontWeight: '600',
    fontSize: RFValue(14),
    color: 'black',
    paddingTop: 22,
    paddingLeft: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 6,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 30,
    marginBottom: 10,
    color: 'black',
  },
  recentContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    gap: 15,
  },
  recentCard: {
    width: 180,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 20,
    overflow: 'hidden',
  },
  activityTextContainer: {},
  recentText: {
    fontSize: RFValue(14),
    fontWeight: '400',
    marginBottom: 20,
    color: 'black',
  },
  recentTime: {
    fontSize: 12,
    color: 'black',
  },
  recentContainerImageContainer: {
    width: 80,
    height: 80,
  },
  recentContainerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  horizontalScrollContainer: {},
  card: {
    marginTop: 20,
    marginRight: 15,
    marginLeft: 20,
    width: 192,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 133,
    resizeMode: 'cover',
  },
  playButton: {
    backgroundColor: '#34A853',
    paddingVertical: 10,
    width: 100,
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 6,
    margin: 80,
    marginLeft: 40,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 600,
  },
});
