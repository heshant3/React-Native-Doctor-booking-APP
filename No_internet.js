import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
export default function No_internet() {
  return (
    <View style={styles.view}>
      <Lottie
        source={require('./internt.json')}
        autoPlay
        loop
        style={{height: 400}}
      />
      <Text style={styles.text}>Please turn on your internet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },

  text: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Poppins-SemiBold',
    color: '#515151',
  },
});
