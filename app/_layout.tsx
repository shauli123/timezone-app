import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen'; // Your screens
import WeekScreen from './screens/WeekScreen';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="היום" component={HomeScreen} />
      <Tab.Screen name="שבוע" component={WeekScreen} />
    </Tab.Navigator>
  );
}
