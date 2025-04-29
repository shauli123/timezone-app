import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Layout from './app/_layout'; // your tab navigator

export default function App() {
  return (
    <SafeAreaProvider>
      <Layout />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}