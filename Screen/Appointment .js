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
import {ref, onValue, update, get, remove} from 'firebase/database';
import {db} from '../config';
import DatePicker from 'react-native-date-picker';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deletedAppointment, setDeletedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  useEffect(() => {
    const appointmentsRef = ref(db, 'users');

    onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const appointmentsArray = Object.values(data)
          .filter(appointment => appointment && appointment.name1)
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

  const handleDeleteDataViewBoxDoubleClick = appointment => {
    setDeletedAppointment(appointment);
    setModalVisible1(true);
  };

  const appointmentStatusChangeButton = async () => {
    if (selectedAppointment && selectedAppointment.name1) {
      const appointmentRef = ref(db, `users/${selectedAppointment.name1}`);

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

  const appointmentDeleteButton = async () => {
    if (deletedAppointment && deletedAppointment.name1) {
      const appointmentRef = ref(db, `users/${deletedAppointment.name1}`);

      try {
        // Remove the entire user data from the database
        await remove(appointmentRef);
        // console.log('User data removed!', appointmentRef);

        // Close the modal after removing the data
        closeModal2();

        // Fetch updated data from the database
        const appointmentsRef = ref(db, 'users');
        const snapshot = await get(appointmentsRef);
        const data = snapshot.val();

        if (data) {
          const appointmentsArray = Object.values(data)
            .filter(appointment => appointment && appointment.name1)
            .sort((a, b) => {
              const dateA = new Date(a.date + 'T' + a.time);
              const dateB = new Date(b.date + 'T' + b.time);

              return dateA - dateB;
            });

          // Update the state with the new data
          setAppointments(appointmentsArray);

          // Filter appointments for the selected date again
          filterAppointmentsForToday(appointmentsArray);
        }
      } catch (error) {
        // Handle errors appropriately
        // console.error('Error removing user data:', error.message);
      }
    } else {
      // Handle the case where deletedAppointment or its id is undefined
      console.error(
        'Selected appointment or its id is undefined:',
        deletedAppointment,
      );
    }
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalVisible(false);
  };

  const closeModal2 = () => {
    setDeletedAppointment(null);
    setModalVisible1(false);
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
                onPress={() => handleDataViewBoxDoubleClick(appointment)}
                onLongPress={() =>
                  handleDeleteDataViewBoxDoubleClick(appointment)
                }>
                <View style={styles.view3_1}>
                  <Text style={styles.text2}>{appointment.name}</Text>
                  <Text style={styles.text2_1}>
                    <Text>{appointment.date} </Text> |{' '}
                    <Text
                      style={{
                        color: '#00b3ff',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {new Date(
                        `${appointment.date} ${appointment.time}`,
                      ).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </Text>
                  </Text>

                  <Text style={styles.text2_2}>{appointment.description}</Text>
                </View>
                <View style={styles.view3_2}>
                  <Icon
                    name="progress-clock"
                    type="material-community"
                    color={appointment.check === '0' ? '#ff401e' : '#d0d0d1'}
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
                    <Text style={styles.deleteTxt}>Appointment ?</Text>
                    <Text style={styles.cardtxt_1}>
                      {selectedAppointment.name}
                    </Text>
                    <Text style={styles.cardtxt_2}>
                      {selectedAppointment.date} |{' '}
                      {new Date(
                        `${selectedAppointment.date} ${selectedAppointment.time}`,
                      ).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </Text>

                    <TouchableHighlight
                      style={[
                        styles.completebtn,
                        {
                          backgroundColor:
                            selectedAppointment &&
                            selectedAppointment.check === '1'
                              ? '#2889EB'
                              : 'red',
                        },
                      ]}
                      underlayColor={
                        selectedAppointment && selectedAppointment.check === '0'
                          ? '#f69c9d'
                          : '#b7d8f8'
                      }
                      onPress={appointmentStatusChangeButton}>
                      <Text style={styles.completebtntxt}>
                        {selectedAppointment &&
                        selectedAppointment.check === '1'
                          ? 'Completed'
                          : 'Uncompleted'}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Show Delete AppointmentDetailsCard if an appointment is selected */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={closeModal2}>
          <View style={styles.modalBackground2}>
            <View style={styles.modalContent2}>
              {deletedAppointment && (
                <>
                  {/* Close button */}
                  <View style={styles.closebtnview}>
                    <TouchableHighlight
                      style={styles.closebtn}
                      onPress={closeModal2}>
                      <Text style={styles.closebtntxt}>X</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.modalContent1}>
                    {/* Your card content here */}
                    <Text style={styles.deleteTxt}>Are you sure?</Text>
                    <Text style={styles.cardtxt_1}>
                      {deletedAppointment.name}
                    </Text>
                    <Text style={styles.cardtxt_2}>
                      {deletedAppointment.date} |{' '}
                      {new Date(
                        `${deletedAppointment.date} ${deletedAppointment.time}`,
                      ).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </Text>

                    <TouchableHighlight
                      style={styles.completebtn2}
                      underlayColor={'#ff9498'}
                      onPress={appointmentDeleteButton}>
                      <Text style={styles.completebtntxt2}>Delete</Text>
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
    marginTop: 1,
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
    fontSize: wp(6.5),
    fontFamily: 'Poppins-SemiBold',
  },

  view3: {
    flexDirection: 'row',
    marginTop: 30,
    width: wp(90),
    height: wp(25),
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
    fontSize: wp(6),
    fontFamily: 'Poppins-Medium',
  },

  text2_1: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: wp(4),
    fontFamily: 'Poppins-Light',
  },

  text2_2: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#515151',
    fontSize: wp(3),
    fontFamily: 'Poppins-Light',
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  // Modal1 styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalContent: {
    backgroundColor: '#ffffff',
    width: responsiveWidth(70),
    height: responsiveWidth(57),
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
    justifyContent: 'center',
    width: responsiveWidth(30),
    height: responsiveWidth(9.5),
    backgroundColor: '#2889EB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  completebtntxt: {
    fontSize: wp(3.6),
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
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
    marginTop: wp(3),
    color: '#515151',
    fontSize: wp(7),
    fontFamily: 'Poppins-bold',
    marginBottom: 7,
  },
  cardtxt_2: {
    color: '#515151',
    fontSize: hp(2),
    fontFamily: 'Poppins-light',
    marginBottom: 20,
  },

  // Modalw styles
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalContent2: {
    backgroundColor: '#ffffff',
    width: responsiveWidth(70),
    height: responsiveWidth(57),
    padding: 0,
    borderRadius: 10,
    elevation: 5,
  },

  deleteTxt: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#515151',
  },

  completebtn2: {
    width: responsiveWidth(30),
    height: responsiveWidth(9.5),
    backgroundColor: '#ff3f58',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
  },

  completebtntxt2: {
    fontSize: wp(3.7),
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
