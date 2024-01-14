import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ref, onValue} from 'firebase/database';
import {db} from '../config';

const Home = () => {
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [tomorrowAppointments, setTomorrowAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.text}>Welcome Doctor</Text>
        <Image
          source={require('../assets/images/banner-1.png')}
          style={styles.image}
        />
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
      </View>
      <View style={styles.view2}>
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
    flex: 1,
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
    marginTop: 6,
    width: wp(90),
    height: hp(13),
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

  image: {
    marginTop: -hp(6.6),
    width: '70%',
    width: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
    overflow: 'hidden',
    // borderRadius: 300,
  },
});
