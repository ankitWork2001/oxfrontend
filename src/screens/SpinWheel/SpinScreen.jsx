import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText, Defs, Stop, LinearGradient } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { getSpinCount } from '../../redux/slices/spinSlice';
import SpinPageBackSide from '../../components/Header/SpinPageBackSide';

const prizes = [
  '$0.11', '$0.33', '$0.50', '$0.66', '$0.80',
  'IPHONE', 'WATCH', '$0', '$111', '$11', '$66', '$1'
];

const { width } = Dimensions.get('window');
const wheelSize = width * 0.8;
const angleBySegment = 360 / prizes.length;
const oneTurn = 360;

function calculateArc(startAngle, endAngle) {
  const r = wheelSize / 2;
  const x1 = r + r * Math.cos((Math.PI / 180) * startAngle);
  const y1 = r + r * Math.sin((Math.PI / 180) * startAngle);
  const x2 = r + r * Math.cos((Math.PI / 180) * endAngle);
  const y2 = r + r * Math.sin((Math.PI / 180) * endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M${r},${r} L${x1},${y1} A${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
}

const SpinScreen = () => {
  const dispatch = useDispatch();
  const { spinCount, dailySpinCount, spinOpenAt } =
  useSelector(state => state.spin.spin) || {};

  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const wheelRotation = useRef(0);

  const handleAddFunds = async () => {
  try {
    const response = await axios.post('/api/wallet/deposit', {
      amount: 50, // or any amount
    }, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    Alert.alert('Balance Added!');
    dispatch(getWalletBalance()); // update redux
  } catch (error) {
    Alert.alert('Failed to add funds');
  }
};


  useEffect(() => {
    dispatch(getSpinCount());
  }, []);

  const spinFromBackend = async () => {
    if (isSpinning || spinCount <= 0) {
      Alert.alert('No Spins Left', 'Please buy more spins to continue.');
      return;
    }

    setIsSpinning(true);
    setWinner('');
    setShowModal(false);

    try {
      const response = await axios.get('/spin/playtwo');
      const resultValue = response?.data?.spin?.resultValue;

      const index = prizes.findIndex(prize => {
        if (prize.startsWith('$')) {
          return parseFloat(prize.slice(1)).toFixed(2) === Number(resultValue).toFixed(2);
        }
        return prize === resultValue;
      });

      if (index >= 0) {
        const rotateTo =
          360 * 6 + (360 - (index * angleBySegment + angleBySegment / 2) - 90);

        Animated.timing(animatedValue, {
          toValue: rotateTo,
          duration: 4000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          wheelRotation.current = rotateTo % oneTurn;
          animatedValue.setValue(wheelRotation.current);
          setWinner(prizes[index]);
          setTimeout(() => setShowModal(true), 500);
          setIsSpinning(false);
          dispatch(getSpinCount()); // refresh from backend
        });
      } else {
        Alert.alert('Error', `Prize not found for: ${resultValue}`);
        setIsSpinning(false);
      }
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Spin failed');
      setIsSpinning(false);
    }
  };

  const handlePurchaseSpin = async () => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    try {
      await axios.post('/spin/purchase', { spinCount: quantity });
      Alert.alert('Success', 'Spins purchased!');
      dispatch(getSpinCount());
      setShowBuyModal(false);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not purchase spins');
    } finally {
      setIsPurchasing(false);
    }
  };

  const interpolatedRotate = animatedValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('../../assests/spinPageBGImage.png')}
      style={styles.BGImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <SpinPageBackSide />

        <View style={styles.spinContainer}>
          <Svg width={wheelSize + 18} height={wheelSize + 18} style={{ position: 'absolute' }}>
            <Circle
              cx={(wheelSize + 18) / 2}
              cy={(wheelSize + 18) / 2}
              r={wheelSize / 2 + 6}
              fill="none"
              stroke="#FFD700"
              strokeWidth={5}
            />
          </Svg>

          <Animated.View style={{ transform: [{ rotate: interpolatedRotate }] }}>
            <Svg width={wheelSize} height={wheelSize}>
              <Defs>
                {prizes.map((_, i) => (
                  <LinearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={i % 2 === 0 ? '#FFE8AC' : '#FFC14D'} />
                    <Stop offset="100%" stopColor={i % 2 === 0 ? '#FF8C4A' : '#9C1000'} />
                  </LinearGradient>
                ))}
              </Defs>
              <G>
                {prizes.map((prize, i) => {
                  const start = i * angleBySegment;
                  const end = (i + 1) * angleBySegment;
                  const path = calculateArc(start, end);
                  const r = (wheelSize / 2) * 0.75;
                  const mid = start + angleBySegment / 2;
                  const x = wheelSize / 2 + r * Math.cos((Math.PI / 180) * mid);
                  const y = wheelSize / 2 + r * Math.sin((Math.PI / 180) * mid);
                  return (
                    <G key={i}>
                      <Path d={path} fill={`url(#grad-${i})`} />
                      <SvgText
                        x={x}
                        y={y}
                        fill="#fff"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        transform={`rotate(${mid}, ${x}, ${y})`}
                      >
                        {prize}
                      </SvgText>
                    </G>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>

          <View style={styles.knobContainer}>
            <View style={styles.knobInside}>
              <Image source={require('../../assests/knob2.png')} style={styles.knobPointer} />
            </View>
          </View>
        </View>

        <View style={styles.btnContainer}>
          <Text style={styles.spinCountText}>
  Spins Left: {spinCount}
</Text>

          <Icon name="keyboard-double-arrow-down" size={50} color="#FFFFFFA1" style={{ marginBottom: 10 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, isSpinning || spinCount === 0 ? { backgroundColor: '#999' } : {}]}
            onPress={spinFromBackend}
            disabled={isSpinning || spinCount === 0}
          >
            <Text style={styles.buttonText}>{isSpinning ? 'Spinning...' : 'Spin Now'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.purchaseButton}
            onPress={() => setShowBuyModal(true)}
          >
            <Text style={styles.purchaseButtonText}>Buy Spin</Text>
          </TouchableOpacity>
        </View>

        {/* WIN MODAL */}
        <Modal transparent visible={showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: RFValue(20), marginBottom: 10, color: 'black' }}>You Won</Text>
              <Text style={{ fontSize: RFValue(24), fontWeight: 'bold', color: 'green' }}>{winner}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.spinModalButton}>
                <Text style={styles.signInButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* BUY MODAL */}
        <Modal transparent visible={showBuyModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: 260 }]}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Buy Spins</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.counterBtn}>
                  <Text style={[styles.counterText, { color: 'white' }]}>−</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 24, marginHorizontal: 20, color: 'black' }}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.counterBtn}>
                  <Text style={[styles.counterText, { color: 'white' }]}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, marginBottom: 20, color: 'black' }}>Total: ${quantity * 1}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setShowBuyModal(false)} style={[styles.counterBtn, { backgroundColor: 'magenta', marginRight: 10 }]}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePurchaseSpin} style={[styles.counterBtn, { backgroundColor: 'magenta' }]}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Buy</Text>
                </TouchableOpacity>

                
                
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SpinScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  BGImage: { flex: 1, width: '100%', height: '100%' },
  spinContainer: { alignItems: 'center', justifyContent: 'center', bottom: 200 },
  knobContainer: { position: 'absolute', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  knobInside: { width: 25, height: 25, borderRadius: 30, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  knobPointer: { position: 'absolute', top: -10, width: 33, height: 40 },
  btnContainer: { justifyContent: 'center', alignItems: 'center', width: '100%', bottom: 180 },
  button: {
    backgroundColor: '#34A853',
    paddingHorizontal: 120,
    paddingVertical: 14,
    borderRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: RFValue(12) },
  purchaseButton: {
    backgroundColor: '#FF8800',
    paddingHorizontal: 120,
    paddingVertical: 14,
    borderRadius: 5,
    marginTop: 10,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  purchaseButtonText: { color: '#fff', fontWeight: 'bold', fontSize: RFValue(12) },
  spinCountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spinModalButton: {
    marginTop: 20,
    backgroundColor: '#34A853',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  signInButtonText: { color: '#fff', fontSize: RFValue(14), fontWeight: '600' },
  counterBtn: {
    padding: 10,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
    backgroundColor: '#28a745',
  },
  counterText: { fontSize: 18, fontWeight: 'bold' },
});

