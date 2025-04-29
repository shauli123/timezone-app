import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { useTaskStore } from '../store/taskStore';

export default function ProfileScreen() {
  const {
    tasks,
    recurringTasks,
    completedRecurring,
  } = useTaskStore();

  const today = dayjs().format('YYYY-MM-DD');

  // סופרים כמה משימות חד פעמיות הושלמו היום
  const completedOneTime = tasks.filter(t => t.date === today && t.done).length;

  // סופרים כמה משימות חוזרות הושלמו היום
  const todayRecurring = recurringTasks.filter(r => {
    const isInRange = !dayjs(today).isBefore(r.startDate) && !dayjs(today).isAfter(r.endDate);
    const isDaily = r.recurrence === 'daily';
    const isWeekly = r.recurrence === 'weekly' && r.weekDays?.includes(dayjs(today).day());
    return isInRange && (isDaily || isWeekly);
  });

  const completedRecurringToday = todayRecurring.filter(r =>
    completedRecurring.find(cr => cr.id === r.id && cr.date === today)
  ).length;

  const totalCompletedToday = completedOneTime + completedRecurringToday;

  // חישוב streak: כמה ימים רצופים סיימת את כל המשימות החוזרות
  let streak = 0;
  for (let i = 0; i < 100; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
  
    const oneTime = tasks.filter(t => t.date === date);
    const recurring = recurringTasks.filter(r => {
      const inRange = !dayjs(date).isBefore(r.startDate) && !dayjs(date).isAfter(r.endDate);
      const isDaily = r.recurrence === 'daily';
      const isWeekly = r.recurrence === 'weekly' && r.weekDays?.includes(dayjs(date).day());
      return inRange && (isDaily || isWeekly);
    });
  
    const allOneTimeDone = oneTime.every(t => t.done);
    const allRecurringDone = recurring.every(r =>
      completedRecurring.find(cr => cr.id === r.id && cr.date === date)
    );
  
    const hasAnyTask = oneTime.length > 0 || recurring.length > 0;
  
    if (!hasAnyTask) continue;
  
    if (allOneTimeDone && allRecurringDone) {
      streak++;
    } else {
      break;
    }
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>מספר משימות שהושלמו היום: {totalCompletedToday}</Text>
      <Text style={styles.label}>רצף ימי הצלחה (Streak): {streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 18, marginVertical: 10 },
});
