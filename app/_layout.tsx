import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'היום' }} />
      <Tabs.Screen name="week" options={{ title: 'שבוע' }} />
    </Tabs>
  );
}
