import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import Navigator from './Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedLoginStatus = await AsyncStorage.getItem('hasLoggedIn');
        setHasLoggedInBefore(storedLoginStatus !== null);
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle the error, you might want to set hasLoggedInBefore to false in this case
      }
    };

    checkLoginStatus();
  }, []);

  if (hasLoggedInBefore === null) {
    // Loading state or a placeholder component can be added here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasLoggedInBefore ? 'Book' : 'Login'}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Book" component={Navigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
