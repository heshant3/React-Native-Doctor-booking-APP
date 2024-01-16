import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
      if (storedLoginStatus && JSON.parse(storedLoginStatus)) {
        navigation.replace('Book');
      }
    } catch (error) {
      //   console.error('Error reading login status from AsyncStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const hardcodedUsername = '123';
    const hardcodedPassword = '123';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      try {
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        navigation.replace('Book');
      } catch (error) {
        // console.error('Error saving login status to AsyncStorage:', error);
      }
    } else {
      alert('Invalid username or password');
    }
  };

  if (isLoading) {
    return null; // or a loading indicator if you prefer
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="#BDBDBD"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.username}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#BDBDBD"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.password}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.text1}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#515151',
    marginBottom: responsiveHeight(10),
    fontSize: responsiveFontSize(3),
    fontFamily: 'Poppins-SemiBold',
  },

  username: {
    marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(1.5),
    color: '#515151',
    paddingLeft: 10,
    alignSelf: 'center',
    width: '90%',
    height: responsiveHeight(9),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
  },

  password: {
    marginBottom: responsiveHeight(7),
    fontSize: responsiveFontSize(1.5),
    color: '#515151',
    paddingLeft: 10,
    alignSelf: 'center',
    width: '90%',
    height: responsiveHeight(9),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
  },

  btn: {
    backgroundColor: '#2889EB',
    width: '90%',
    height: responsiveHeight(7),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },

  text1: {
    fontSize: responsiveFontSize(2),
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
