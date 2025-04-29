import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function scheduleNotification(text: string, date: Date) {
  if (date.getTime() <= Date.now()) return
  await Notifications.scheduleNotificationAsync({
    content: { title: 'תזכורת', body: text },
    trigger: date,
  })
}
