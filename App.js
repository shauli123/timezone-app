import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './app/screens/HomeScreen'
import StatsScreen from './app/screens/StatsScreen'
import ProfileScreen from './app/screens/ProfileScreen'

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="בית" component={HomeScreen} />
        <Tab.Screen name="זמן שלי" component={StatsScreen} />
        <Tab.Screen name="פרופיל" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
