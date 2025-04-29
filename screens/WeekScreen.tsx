import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import dayjs from 'dayjs';
import { useTaskStore } from '../store/taskStore.ts';

export default function WeekScreen() {
  const allTasks = useTaskStore(s => s.tasks);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
      return {
        date,
        tasks: allTasks.filter(t => t.date === date),
      };
    });
  }, [allTasks]);

  return (
    <FlatList
      data={days}
      keyExtractor={d => d.date}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 0.5 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
            {dayjs(item.date).format('dddd, YYYY-MM-DD')}
          </Text>
          {item.tasks.length > 0 ? (
            item.tasks.map(t => (
              <Text key={t.id} style={{ marginLeft: 10 }}>
                {t.time} – {t.text} {t.done ? '✅' : ''}
              </Text>
            ))
          ) : (
            <Text style={{ marginLeft: 10, color: '#666' }}>
              אין משימות
            </Text>
          )}
        </View>
      )}
    />
  );
}
