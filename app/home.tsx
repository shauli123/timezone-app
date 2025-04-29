import React, { useState } from 'react'
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'

type Task = {
  id: string
  hour: string
  description: string
}

export default function HomeScreen() {
  const [hour, setHour] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = () => {
    if (!hour || !description) return
    const newTask: Task = {
      id: Date.now().toString(),
      hour,
      description,
    }
    setTasks(prev => [...prev, newTask])
    setHour('')
    setDescription('')
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}:00` : `${i}:00`))

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>הוספת משימה</Text>
      <TextInput
        style={styles.input}
        placeholder="שעה (לדוג׳ 09:00)"
        value={hour}
        onChangeText={setHour}
      />
      <TextInput
        style={styles.input}
        placeholder="תיאור משימה"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="הוסף משימה" onPress={addTask} />

      <Text style={[styles.header, { marginTop: 30 }]}>לוח משימות יומי</Text>
      {hours.map(h => {
        const task = tasks.find(t => t.hour === h)
        return (
          <View key={h} style={styles.row}>
            <Text style={styles.time}>{h}</Text>
            {task ? (
              <View style={styles.taskBox}>
                <Text style={styles.taskText}>{task.description}</Text>
                <TouchableOpacity onPress={() => deleteTask(task.id)}>
                  <Text style={styles.delete}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.empty}>--</Text>
            )}
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  time: {
    width: 60,
    fontWeight: 'bold',
  },
  taskBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  taskText: {
    flex: 1,
  },
  delete: {
    marginLeft: 10,
    fontSize: 18,
  },
  empty: {
    color: '#999',
  },
})
