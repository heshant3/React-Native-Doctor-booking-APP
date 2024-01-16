import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Navigator from './Navigator';
import No_internet from './No_internet';
import Loggingfuntion from './loggingfuntion';

const App = () => {
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
