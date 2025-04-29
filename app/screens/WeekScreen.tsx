import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const WeekScreen = () => {
  const [tasks, setTasks] = useState<{ key: string; text: string; time: string }[]>([]);

  useEffect(() => {
    // Example of pre-loaded tasks with times
    setTasks([
      { key: '1', text: 'Task 1', time: '09:30' },
      { key: '2', text: 'Task 2', time: '12:00' },
      { key: '3', text: 'Task 3', time: '14:30' },
    ]);
  }, []);

  const renderTask = ({ item }: { item: { key: string; text: string; time: string } }) => (
    <View style={styles.taskContainer}>
      <Text>{item.text}</Text>
      <Text>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>שבוע</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  taskContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default WeekScreen;
