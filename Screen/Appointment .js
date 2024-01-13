import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from '@rneui/themed';
import {ref, onValue, update, get} from 'firebase/database';
import {db} from '../config';
import DatePicker from 'react-native-date-picker';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const appointmentsRef = ref(db, 'users');

    onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const appointmentsArray = Object.values(data)
          .filter(appointment => appointment && appointment.name)
          .sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);

            return dateA - dateB;
          });

        setAppointments(appointmentsArray);

        // Filter appointments for today initially
        filterAppointmentsForToday(appointmentsArray);

        setLoading(false);
      }
    });
  }, []);

  const handleIconClick = () => {
    setDatePickerVisible(true);
  };

  const handleDatePickerConfirm = date => {
    setDatePickerVisible(false);
    setSelectedDate(date);

    // Filter appointments based on the selected date
    const filtered = appointments.filter(
      appointment =>
        new Date(appointment.date + 'T' + appointment.time).toDateString() ===
        date.toDateString(),
    );

    setFilteredAppointments(filtered);
  };

  const handleDatePickerCancel = () => {
    setDatePickerVisible(false);

    // Reset to today's appointments when the date is cancelled
    filterAppointmentsForToday(appointments);
  };

  const filterAppointmentsForToday = appointmentsArray => {
    const today = new Date();
    const filtered = appointmentsArray.filter(
      appointment =>
        new Date(appointment.date + 'T' + appointment.time).toDateString() ===
        today.toDateString(),
    );
    setFilteredAppointments(filtered);
  };

  const handleDataViewBoxDoubleClick = appointment => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleCompleteButtonPress = async () => {
    if (selectedAppointment && selectedAppointment.name) {
      const appointmentRef = ref(db, `users/${selectedAppointment.name}`);

      try {
        // Fetch the current 'check' value from the database
        const snapshot = await get(appointmentRef);
        const currentCheckValue = snapshot.val().check;

        // Toggle the 'check' field value between '0' and '1'
        const updatedCheckValue = currentCheckValue === '0' ? '1' : '0';

        // Update the 'check' field
        await update(appointmentRef, {check: updatedCheckValue});
        // console.log('Appointment check value updated!', appointmentRef);

        // Close the modal after updating
        closeModal();
      } catch (error) {
        // console.error('Error updating appointment:', error.message);
      }
    } else {
      // console.error(
      //   'Selected appointment or its id is undefined:',
      //   selectedAppointment,
      // );
    }
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <View style={styles.view1_1}>
          <View style={styles.view1_11}>
            <Text style={styles.text}>Appointment History</Text>
          </View>
          <View style={styles.view1_12}>
            <TouchableOpacity onPress={handleIconClick}>
              <Icon
                style={styles.iconn}
                name="calendar"
                type="evilicon"
                color={'#515151'}
                size={39}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.view2}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#515151" />
            </View>
          )}
          {!loading &&
            filteredAppointments.map((appointment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.view3}
                onPress={() => handleDataViewBoxDoubleClick(appointment)}>
                <View style={styles.view3_1}>
                  <Text style={styles.text2}>{appointment.name}</Text>
                  <Text style={styles.text2_1}>
                    {appointment.date} {appointment.time}
                  </Text>
                  <Text style={styles.text2_2}>{appointment.description}</Text>
                </View>
                <View style={styles.view3_2}>
                  <Icon
                    name="progress-clock"
                    type="material-community"
                    color={appointment.check === '0' ? 'red' : '#d0d0d1'}
                    size={39}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Show DatePicker */}
        <DatePicker
          modal
          mode="date"
          open={isDatePickerVisible}
          date={selectedDate}
          onConfirm={handleDatePickerConfirm}
          onCancel={handleDatePickerCancel}
        />

        {/* Show AppointmentDetailsCard if an appointment is selected */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {selectedAppointment && (
                <>
                  {/* Close button */}
                  <View style={styles.closebtnview}>
                    <TouchableHighlight
                      style={styles.closebtn}
                      onPress={closeModal}>
                      <Text style={styles.closebtntxt}>X</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.modalContent1}>
                    {/* Your card content here */}
                    <Text style={styles.cardtxt_1}>
                      {selectedAppointment.name}
                    </Text>
                    <Text style={styles.cardtxt_2}>
                      {selectedAppointment.date} {selectedAppointment.time}
                    </Text>
                    <TouchableHighlight
                      style={styles.completebtn}
                      onPress={handleCompleteButtonPress} // Call the new function here
                    >
                      <Text style={styles.completebtntxt}>Completed </Text>
                    </TouchableHighlight>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },

  view1: {
    flex: 1,
  },

  view1_1: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.1,
    flexDirection: 'row',
    height: 10,
  },

  view1_11: {
    flex: 5,
  },

  view1_12: {
    flex: 1,
  },

  view2: {
    flex: 1,
    marginTop: 15,
  },

  view3_1: {
    flex: 3,
    justifyContent: 'center',
  },

  view3_2: {
    flex: 1,
    justifyContent: 'center',
  },

  text: {
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(4),
    fontFamily: 'Poppins-SemiBold',
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
    borderBottomWidth: 1,
  },

  text2: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(3.8),
    fontFamily: 'Poppins-Medium',
  },

  text2_1: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(2.3),
    fontFamily: 'Poppins-Light',
  },

  text2_2: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: hp(2),
    fontFamily: 'Poppins-Light',
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalContent: {
    backgroundColor: '#ffffff',
    width: wp(70),
    height: hp(30),
    padding: 0,
    borderRadius: 10,
    elevation: 5,
  },

  closebtnview: {
    paddingRight: 10,
    alignItems: 'flex-end',
  },

  modalContent1: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  completebtn: {
    width: 200,
    height: 40,
    marginTop: 10,
    backgroundColor: '#2889EB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  completebtntxt: {
    fontSize: 17,
    color: '#ffffff',
    textAlign: 'center',
  },

  closebtn: {
    marginTop: 10,
    backgroundColor: '#e44c41',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 50,
  },

  closebtntxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  cardtxt_1: {
    marginTop: 20,
    color: '#515151',
    fontSize: hp(4),
    fontFamily: 'Poppins-bold',
    marginBottom: 7,
  },
  cardtxt_2: {
    color: '#515151',
    fontSize: hp(2),
    fontFamily: 'Poppins-light',
    marginBottom: 20,
  },
});