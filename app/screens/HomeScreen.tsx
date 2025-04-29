import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const scheduleNotification = async (taskName: string, time: string) => {
  const trigger = new Date(time);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Reminder: ${taskName}`,
      body: `It's time to complete your task: ${taskName}`,
    },
    trigger: {
      hour: trigger.getHours(),
      minute: trigger.getMinutes(),
      repeats: true,
    },
  });
};

const HomeScreen = () => {
  const [task, setTask] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || time;
    setShowPicker(false);
    setTime(currentDate);
  };

  const handleSaveTask = () => {
    scheduleNotification(task, time.toISOString());
    console.log(`Task: ${task}, Time: ${time}`);
  };

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <View>
      <Text>Welcome to the Timezone App</Text>
      <TextInput
        placeholder="Task Name"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Pick Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Button title="Save Task" onPress={handleSaveTask} />
    </View>
  );
};

export default HomeScreen;
