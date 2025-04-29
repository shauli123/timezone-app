import * as Notifications from 'expo-notifications';

export async function scheduleNotification(text: string, date: Date) {
  if (date.getTime() <= Date.now()) {
    console.warn('Cannot schedule notification in the past');
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: { title: 'תזכורת', body: text },
    trigger: date,
  });
}
