import {StyleSheet, Text, View, ActivityIndicator, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ref, onValue, update} from 'firebase/database';
import {db} from '../config';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [tomorrowAppointments, setTomorrowAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    // Load session status from AsyncStorage on component mount
    const loadSessionStatus = async () => {
      try {
        const storedSessionStatus = await AsyncStorage.getItem('sessionStatus');
        if (storedSessionStatus !== null) {
          setSessionActive(storedSessionStatus === 'active');
        }
      } catch (error) {
        // console.error('Error loading session status from AsyncStorage:', error);
      }
    };

    loadSessionStatus();

    // Firebase listener for appointments
    const appointmentsRef = ref(db, 'users');
    onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const todayAppointmentsArray = Object.values(data).filter(
          appointment => appointment.date === today,
        );
        const tomorrowAppointmentsArray = Object.values(data).filter(
          appointment => appointment.date === tomorrow,
        );

        setTodayAppointments(todayAppointmentsArray.length);
        setTomorrowAppointments(tomorrowAppointmentsArray.length);
      }
      setLoading(false);
    });
  }, []);

  const toggleSession = async () => {
    try {
      // Update the Firebase Realtime Database with the new session state
      const updates = {};
      updates['/sessionStatus'] = sessionActive ? 'inactive' : 'active';
      update(ref(db, 'Doctor '), updates);

      // Save the session status to AsyncStorage
      await AsyncStorage.setItem(
        'sessionStatus',
        sessionActive ? 'inactive' : 'active',
      );

      // Toggle the local state
      setSessionActive(previousState => !previousState);
    } catch (error) {
      console.error('Error toggling session status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.text}>Welcome Doctor</Text>
        <View style={styles.view10}>
          <View style={styles.view10_1}>
            <Text
              style={[styles.text_3, {color: sessionActive ? 'red' : 'grey'}]}>
              Session is {sessionActive ? 'active' : 'inactive'}
            </Text>
          </View>
          <View style={styles.view10_2}>
            <Switch
              thumbColor={sessionActive ? 'white' : 'white'}
              trackColor={{false: 'grey', true: 'tomato'}}
              ios_backgroundColor="grey"
              value={sessionActive}
              onValueChange={() => {
                toggleSession();
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.view2}>
        <Text style={styles.text1}>Appointments</Text>
        <View style={styles.view3}>
          <View style={styles.view3_1}>
            <Text style={styles.text2}>Today </Text>
          </View>
          <View style={styles.view3_2}>
            {loading ? (
              <ActivityIndicator size="small" color="#515151" />
            ) : (
              <Text style={styles.text2_1}>{todayAppointments}</Text>
            )}
          </View>
        </View>
        <View style={styles.view9}>
          <View style={styles.view3_1}>
            <Text style={styles.text2}>Tomorrow </Text>
          </View>
          <View style={styles.view3_2}>
            {loading ? (
              <ActivityIndicator size="small" color="#515151" />
            ) : (
              <Text style={styles.text2_1}>{tomorrowAppointments}</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  view1: {
    flex: 1,
  },
  view2: {
    // backgroundColor: 'red',
    flex: 2,
  },

  view3: {
    flexDirection: 'row',
    marginTop: 30,
    width: wp(90),
    height: hp(13),
    justifyContent: 'center',
    alignItems: 'left',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#515151',
  },

  view9: {
    flexDirection: 'row',
    marginTop: 30,
    width: wp(90),
    height: hp(13),
    justifyContent: 'center',
    alignItems: 'left',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#515151',
  },

  view10: {
    marginTop: responsiveHeight(4),
    flexDirection: 'row',
    width: responsiveWidth(90),
    height: responsiveHeight(10),
    justifyContent: 'center',
    alignItems: 'left',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#515151',
  },

  view3_1: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'left',
  },

  view10_2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  view10_1: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'left',
  },

  text_3: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Light',
  },

  view3_2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
  },

  text: {
    marginTop: 30,
    marginLeft: 20,
    color: '#515151',
    fontSize: wp(6.5),
    fontFamily: 'Poppins-SemiBold',
  },

  text1: {
    marginTop: hp(3),
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3),
    fontFamily: 'Poppins-SemiBold',
  },

  text2: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3.8),
    fontFamily: 'Poppins-Light',
  },

  text2_1: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3.8),
    fontFamily: 'Poppins-Medium',
  },

  text3: {
    marginLeft: 0,
    color: '#515151',
    fontSize: hp(3.8),
    fontFamily: 'Poppins-Light',
  },

  imgview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(20),
  },
});
