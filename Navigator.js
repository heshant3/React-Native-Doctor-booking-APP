import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Screen/Home';
import Appointment from './Screen/Appointment ';
import Book from './Screen/Book';
import {Icon} from '@rneui/themed';

const Tab = createBottomTabNavigator();

export default function Navigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2889eb',
        tabBarInactiveTintColor: '#a8a8aa',
        tabBarStyle: {height: 70},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon name="home" type="octicon" color={color} size={27} />
          ),
        }}
      />
      <Tab.Screen
        name="Book "
        component={Book}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="calendar-edit"
              type="material-community"
              color={color}
              size={27}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Appointment "
        component={Appointment}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon name="users" type="feather" color={color} size={27} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
