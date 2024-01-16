import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import 'react-native-gesture-handler';
import Navigator from './Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Book" component={Navigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
