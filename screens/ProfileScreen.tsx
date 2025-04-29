import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import dayjs from 'dayjs';

export default function ProfileScreen() {
  const { tasks, streak, longestStreak } = useTaskStore(state => ({
    tasks: state.tasks,
    streak: state.streak,
    longestStreak: state.longestStreak,
  }));

  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>פרופיל</Text>

      <View style={styles.statBox}>
        <Text style={styles.label}>🔥 רצף נוכחי:</Text>
        <Text style={styles.value}>{streak} ימים</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>🏆 רצף שיא:</Text>
        <Text style={styles.value}>{longestStreak} ימים</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>✅ משימות שהושלמו:</Text>
        <Text style={styles.value}>{completedTasks} מתוך {totalTasks}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  statBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
