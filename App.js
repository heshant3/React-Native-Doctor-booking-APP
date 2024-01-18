import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import No_internet from './No_internet';
import Loggingfuntion from './loggingfuntion';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected ? (
    // Your normal app content goes here
    <Loggingfuntion />
  ) : (
    // Display a message when not connected
    <No_internet />
  );
};

export default App;
