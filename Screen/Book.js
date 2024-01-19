import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableHighlight,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import {Button} from '@rneui/themed';
import {ref, push, set} from 'firebase/database';
import {db} from '../config';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Book = () => {
  const [date, setDate] = useState(new Date());
  const [name, setname] = useState('');
  const [description, setdescription] = useState('');

  const [isPopupVisible, setPopupVisible] = useState(false);

  async function create() {
    // Show the popup card
    setPopupVisible(true);
  }

  const submitDataToDatabase = () => {
    const dateOnly = date.toISOString().split('T')[0];
    const timeOnly = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    // Use push to automatically generate a unique numerical ID
    const newAppointmentRef = push(ref(db, 'users'));

    set(newAppointmentRef, {
      name1: newAppointmentRef.key, // Use the automatically generated key as the name
      name: name,
      description: description,
      date: dateOnly,
      time: timeOnly,
      check: '1',
    })
      .then(() => {
        setname('');
        setdescription('');
        setDate(new Date());
        Alert.alert('Booking is complete');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  const onDateChange = newDate => {
    setDate(newDate);
  };

  const isButtonDisabled = !name;

  const handleOkPress = () => {
    // Submit data to the database
    submitDataToDatabase();

    // Close the popup card
    setPopupVisible(false);
  };

  const handleCancelPress = () => {
    // Close the popup card without submitting data
    setPopupVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.text}>Booking Appointment</Text>
        <ScrollView>
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
              textColor="#000"
              backgroundColor="#ffffff"
              alignSelf="center"
              date={date}
              onDateChange={onDateChange}
              mode="datetime"
            />
            <Button
              onPress={create}
              title="Book Now"
              titleStyle={styles.btntitle}
              buttonStyle={styles.btn}
              disabled={isButtonDisabled}
            />
          </View>
        </ScrollView>
      </View>

      {isPopupVisible && (
        <View style={styles.popup}>
          <View style={styles.popupCard}>
            <View style={styles.closebtnview}>
              <TouchableHighlight
                underlayColor={'#ff9498'}
                onPress={handleCancelPress}
                style={styles.closebtn}>
                <Text style={styles.closebtntxt}>X</Text>
              </TouchableHighlight>
            </View>
            <Text style={styles.popupText}>Review your booking:</Text>
            <Text style={styles.popupText1}>{name}</Text>
            <Text style={styles.popupText2}>
              {date.toLocaleDateString()} |{' '}
              {date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>
            <TouchableHighlight
              onPress={handleOkPress}
              underlayColor={'#b7d8f8'}
              style={styles.btn1}>
              <Text style={styles.btntitle1}>Confirm</Text>
            </TouchableHighlight>
          </View>
        </View>
      )}
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
  },

  view2: {
    flex: 1,
    marginTop: 15,
  },

  text: {
    marginTop: 30,
    marginLeft: 20,
    color: '#515151',
    fontSize: wp(6.5),
    fontFamily: 'Poppins-SemiBold',
  },

  text1: {
    marginTop: 30,
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3),
    fontFamily: 'Poppins-Medium',
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
  },

  btn: {
    marginTop: hp(3),
    alignSelf: 'center',
    justifyContent: 'center',
    width: wp(70),
    height: hp(8),
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

  popup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  popupCard: {
    backgroundColor: '#ffffff',
    width: responsiveWidth(70),
    height: responsiveWidth(57),
    padding: 0,
    borderRadius: 10,
    elevation: 5,
  },

  popupText: {
    alignSelf: 'center',
    color: '#515151',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Poppins-light',
    marginBottom: 20,
  },

  popupText1: {
    alignSelf: 'center',
    color: '#515151',
    fontSize: responsiveFontSize(3.5),
    fontFamily: 'Poppins-light',
    marginBottom: 7,
  },

  popupText2: {
    alignSelf: 'center',
    color: '#515151',
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Poppins-light',
  },

  btn1: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: responsiveWidth(40),
    height: responsiveWidth(10),
    backgroundColor: '#2889EB',
    borderColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 5,
    fontSize: 42,
    marginTop: 30,
    marginBottom: 20,
  },

  btntitle1: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#ffffff',
  },

  closebtn: {
    marginTop: 10,
    backgroundColor: '#e44c41',
    alignItems: 'center',
    justifyContent: 'center',
    height: 27,
    width: 27,
    borderRadius: 50,
  },

  closebtntxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  closebtnview: {
    paddingRight: 10,
    alignItems: 'flex-end',
  },
});
