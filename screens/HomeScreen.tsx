import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { scheduleNotification } from '../utils/notifications';
import dayjs from 'dayjs';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  // subscribe to full tasks array
  const allTasks = useTaskStore(s => s.tasks);
  const { addTask, deleteTask, toggleTask, clearTodayTasks } = useTaskStore();

  // filter locally
  const tasks = allTasks.filter(t => t.date === date);

  const add = async () => {
    if (!text || !time) return;
    const id = Date.now().toString();
    const task = { id, text, date, time, done: false };
    addTask(task);
    const [h, m] = time.split(':');
    const notifyDate = dayjs(date).hour(Number(h)).minute(Number(m)).toDate();
    await scheduleNotification(text, notifyDate);
    setText('');
    setTime('');
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="משימה"
        value={text}
        onChangeText={setText}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="שעה (HH:mm)"
        value={time}
        onChangeText={setTime}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="תאריך (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="הוסף" onPress={add} />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text>
              {item.time} - {item.text} {item.done ? '✅' : ''}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="✔" onPress={() => toggleTask(item.id)} />
              <Button title="🗑" onPress={() => deleteTask(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="סיים יום"
          onPress={() => clearTodayTasks(dayjs().format('YYYY-MM-DD'))}
        />
      </View>
    </View>
  );
}