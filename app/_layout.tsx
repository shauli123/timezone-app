import { Tabs } from 'expo-router';
import React, { useEffect, useState, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import dayjs from 'dayjs';
import { useTaskStore } from '../store/taskStore';
// Global notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted!');
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    })();
  }, []);
  const checkStreak = useTaskStore(s => s.checkStreak);

  useEffect(() => {
    const interval = setInterval(() => {
      checkStreak();
    }, 60 * 60 * 1000); // every 1 hour

    return () => clearInterval(interval);
  }, []);
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'יומי' }} />
      <Tabs.Screen name="week" options={{ title: 'שבועי' }} />
      <Tabs.Screen name="profile" options={{ title: 'פרופיל' }}/>
    </Tabs>
  );
}
