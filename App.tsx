import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="היום" component={HomeScreen} />
        <Tab.Screen name="שבוע" component={WeekScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
