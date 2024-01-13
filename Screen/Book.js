import {StyleSheet, Text, View, TextInput, Vibration} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import {Button} from '@rneui/themed';
import {ref, set} from 'firebase/database';
import {db} from '../config';

const Book = () => {
  const [date, setDate] = useState(new Date());
  const [name, setname] = useState('');
  const [description, setdescription] = useState('');

  function create() {
    const dateString = date.toISOString();
    const dateOnly = dateString.split('T')[0];
    const timeOnly = dateString.split('T')[1].substring(0, 8);

    set(ref(db, 'users/' + name), {
      name: name,
      description: description,
      date: dateOnly,
      time: timeOnly,
      check: '1',
    })
      .then(() => {
        // console.log('Document successfully written!');
        setname('');
        setdescription('');
        setDate(new Date());
      })
      .catch(error => {
        // console.error('Error writing document: ', error);
      });
  }

  // Vibrate when date changes
  const onDateChange = newDate => {
    Vibration.vibrate(100); // Vibrate when date changes
    setDate(newDate);
  };

  // Check if the "Book Now" button should be enabled
  const isButtonDisabled = !name;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.text}>Booking Appointment</Text>
        <View style={styles.view2}>
          <TextInput
            value={name}
            onChangeText={name => {
              setname(name);
            }}
            placeholder="Name"
            placeholderTextColor="#BDBDBD"
            style={styles.name}
          />
          <TextInput
            value={description}
            onChangeText={description => {
              setdescription(description);
            }}
            placeholder="Describe"
            placeholderTextColor="#BDBDBD"
            style={styles.description}
          />
          <Text style={styles.text1}> Date & Time</Text>
          <DatePicker
            timeZoneOffsetInMinutes={0}
            textColor="#000"
            backgroundColor="#ffffff"
            alignSelf="center"
            date={date}
            onDateChange={onDateChange}
            // onDateChange={onDateChange} // Use the updated onDateChange function
            mode="datetime"
          />
          <Button
            onPress={create}
            title="Book Now"
            titleStyle={styles.btntitle}
            buttonStyle={styles.btn}
            disabled={isButtonDisabled} // Set the disabled prop based on the condition
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },

  view1: {
    flex: 1,
    // backgroundColor: 'red',
  },

  view2: {
    flex: 1,
    marginTop: 15,
  },

  text: {
    marginTop: 30,
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(4),
    fontFamily: 'Poppins-SemiBold',
    // fontWeight: 'bold',
  },

  text1: {
    marginTop: 30,
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3),
    fontFamily: 'Poppins-Medium',

    // fontWeight: 'bold',
  },

  name: {
    color: '#515151',
    fontSize: hp(2.8),
    paddingLeft: 10,
    alignSelf: 'center',
    width: '90%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    // fontWeight: 'bold',
  },

  description: {
    textAlignVertical: 'top',
    marginTop: 20,
    color: '#515151',
    fontSize: hp(2.8),
    paddingLeft: 10,
    alignSelf: 'center',
    width: '90%',
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    // fontWeight: 'bold',
  },
  btn: {
    marginTop: 90,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 350,
    height: 60,
    backgroundColor: '#2889EB',
    borderColor: 'transparent',
    borderWidth: 10,
    borderRadius: 5,
    paddingVertical: 5,
    fontSize: 42,
  },

  btntitle: {
    fontSize: 25,
  },
});
