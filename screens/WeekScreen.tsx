import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { useTaskStore } from '../store/taskStore';

export default function WeekScreen() {
  const { getTasksForDate } = useTaskStore();

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    const { oneTime, recurring } = getTasksForDate(date);
    return { date, tasks: [...oneTime.map(t => ({ type: 'one', ...t })), ...recurring.map(r => ({ type: 'rec', ...r }))] };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>לוח השבוע:</Text>
      <FlatList
        data={days}
        keyExtractor={d => d.date}
        renderItem={({ item }) => (
          <View style={styles.dayBlock}>
            <Text style={styles.date}>{dayjs(item.date).format('dddd – DD/MM')}</Text>
            {item.tasks.length === 0 ? (
              <Text style={styles.empty}>אין משימות</Text>
            ) : (
              item.tasks.map(t => (
                <Text key={t.id} style={styles.task}>
                  {t.time} - {t.text} {t.done ? '✅' : ''}
                </Text>
              ))
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  dayBlock: { marginBottom: 15 },
  date: { fontWeight: 'bold', fontSize: 16 },
  task: { marginLeft: 10 },
  empty: { fontStyle: 'italic', marginLeft: 10 },
});
