
// import React, { useEffect } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import MainStackNavigator from './src/navigation/MainStackNavigator';
// import { store } from './src/redux/store';
// import { loadToken } from './src/redux/slices/authSlice';
// import Loader from './src/components/Loader';

// const AppContent = () => {
//   const dispatch = useDispatch();
//   const loading = useSelector(state => state.auth.loading);
//   const userToken = useSelector(state => state.auth.userToken);
//   const [tokenChecked, setTokenChecked] = React.useState(false);

//   useEffect(() => {
//     dispatch(loadToken()).finally(() => setTokenChecked(true));
//   }, [dispatch]);

//   if (!tokenChecked || loading) {
//     return <Loader />;
//   }

//   return <MainStackNavigator />;
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <AppContent />
//       </SafeAreaProvider>
//     </Provider>
//   );
// };

// export default App;

import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { store } from './src/redux/store';
import { loadToken } from './src/redux/slices/authSlice';
import Loader from './src/components/Loader';
import Toast from 'react-native-toast-message';

import { applyArrayPolyfills } from './src/utils/polyfills';
applyArrayPolyfills(); // Call once before anything else
  
const AppContent = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const userToken = useSelector(state => state.auth.userToken);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    dispatch(loadToken()).finally(() => setTokenChecked(true));
  }, [dispatch]);

  if (!tokenChecked || loading) {
    return <Loader />;
  }

  return <MainStackNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
        {/* Toast must be here so it works globally */}
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
