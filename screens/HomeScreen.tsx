import React, { useState } from 'react'
import {
  View, Text, TextInput, Button, FlatList, Switch, TouchableOpacity, StyleSheet
} from 'react-native'
import dayjs from 'dayjs'
import { useTaskStore, Task, RecurringTask } from '../store/taskStore'
import { scheduleNotification } from '../utils/notifications'

export default function HomeScreen() {
  const today = dayjs().format('YYYY-MM-DD')

  // שדות קלט
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)     // מטלה חוזרת בכלל?
  const [isWeekly, setIsWeekly] = useState(false)           // מטלה חוזרת שבועית?
  const [startDate, setStartDate] = useState(today)         // מתי החזרה מתחילה
  const [endDate, setEndDate] = useState(today)             // מתי החזרה מסתיימת
  const [chosenDate, setChosenDate] = useState(today)       // תאריך חד-פעמי (אם לא חוזרת)
  const [weekDays, setWeekDays] = useState<number[]>([])    // ימים בשבוע למטלות שבועיות

  const {
    tasks,
    recurringTasks,
    completedRecurring,
    addTask,
    deleteTask,
    toggleTask,
    addRecurringTask,
    deleteRecurringTask,
    toggleRecurring,
  } = useTaskStore()

  // סינון מטלות חד-פעמיות להיום
  const todaysOneTime = tasks.filter(t => t.date === today)

  // סינון מטלות חוזרות יומיות/שבועיות בתאריך של היום
  const todaysRecurring = recurringTasks
    .filter(r => {
      const inRange =
        !dayjs(today).isBefore(r.startDate) &&
        !dayjs(today).isAfter(r.endDate)

      if (r.recurrence === 'daily') {
        return inRange
      }
      if (r.recurrence === 'weekly') {
        const dow = dayjs(today).day() // 0–6
        return inRange && r.weekDays.includes(dow)
      }
      return false
    })
    .map(r => ({
      ...r,
      done: completedRecurring.some(cr => cr.id === r.id && cr.date === today)
    }))

  // מאחדים וממיינים לפי שעה
  const combined = [
    ...todaysOneTime.map(t => ({ type: 'one' as const, ...t })),
    ...todaysRecurring.map(r => ({ type: 'rec' as const, ...r }))
  ].sort((a, b) => a.time.localeCompare(b.time))

  // טיפול בהוספה
  const onAdd = async () => {
    if (!text || !time) return

    if (isRecurring) {
      // מטלה חוזרת
      const rec: Omit<RecurringTask, 'id'> = {
        text,
        time,
        startDate,
        endDate,
        recurrence: isWeekly ? 'weekly' : 'daily',
        weekDays: isWeekly ? weekDays : []
      }
      addRecurringTask(rec)
    } else {
      // מטלה חד-פעמית
      const id = Date.now().toString()
      const task: Task = { id, text, date: chosenDate, time, done: false }
      addTask(task)
    }

    // תזכורת
    const [h, m] = time.split(':').map(Number)
    const notifyDate = dayjs(
      isRecurring ? startDate : chosenDate
    ).hour(h).minute(m).toDate()
    await scheduleNotification(text, notifyDate)

    // ריענון שדות
    setText(''); setTime('')
  }

  // שינוי ימים בשבוע
  const toggleDow = (d: number) => {
    setWeekDays(ws =>
      ws.includes(d) ? ws.filter(x => x !== d) : [...ws, d]
    )
  }

  return (
    <View style={styles.container}>
      {/* שדות קלט בסיסיים */}
      <TextInput
        placeholder="המשימה שלי..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <TextInput
        placeholder="שעה (HH:mm)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      {/* מתג חוזר */}
      <View style={styles.row}>
        <Switch value={isRecurring} onValueChange={setIsRecurring} />
        <Text style={{ marginLeft: 8 }}>חוזרת</Text>
      </View>

      {isRecurring ? (
        <>
          {/* טווח תאריכים לכל החזרה */}
          <TextInput
            placeholder="מ־ (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
          />
          <TextInput
            placeholder="עד (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.input}
          />

          {/* מתג שבועי */}
          <View style={styles.row}>
            <Switch value={isWeekly} onValueChange={setIsWeekly} />
            <Text style={{ marginLeft: 8 }}>שבועי</Text>
          </View>

          {/* בחירת ימי שבוע */}
          {isWeekly && (
            <View style={styles.weekDays}>
              {['א','ב','ג','ד','ה','ו','ש'].map((d, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleDow(i)}
                  style={[
                    styles.dayBtn,
                    weekDays.includes(i) && styles.daySel
                  ]}
                >
                  <Text>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      ) : (
        // תאריך חד־פעמי
        <TextInput
          placeholder="תאריך (YYYY-MM-DD)"
          value={chosenDate}
          onChangeText={setChosenDate}
          style={styles.input}
        />
      )}

      <Button title="הוסף משימה" onPress={onAdd} />

      {/* רשימת מטלות */}
      <FlatList
        data={combined}
        keyExtractor={item => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ flex: 1 }}>
              {item.time} – {item.text} {item.done ? '✅' : ''}
            </Text>

            {/* כפתורי ✔ ו־🗑 */}
            {item.type === 'one' ? (
              <>
                <Button title="✔" onPress={() => toggleTask(item.id)} />
                {/* גם למשימות עתידיות */}
                <Button title="🗑" onPress={() => deleteTask(item.id)} />
              </>
            ) : (
              <>
                <Button title="✔" onPress={() => toggleRecurring(item.id, today)} />
                <Button title="🗑" onPress={() => deleteRecurringTask(item.id)} />
              </>
            )}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weekDays: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  dayBtn: {
    width: 32, height: 32, borderWidth: 1, margin: 2,
    alignItems: 'center', justifyContent: 'center'
  },
  daySel: { backgroundColor: '#ddd' },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 6
  }
})
