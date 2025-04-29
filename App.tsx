import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import dayjs from 'dayjs';
import { useTaskStore } from './store/taskStore'; // adjust if needed
import Layout from './app/_layout'; // your main layout/navigation

export default function App() {
  
  return <Layout />;
}
