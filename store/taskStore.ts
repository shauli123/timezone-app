import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

export type Task = {
  id: string;
  text: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  done: boolean;
};

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearTodayTasks: (today: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
      })),
      clearTodayTasks: (today) => set((state) => ({
        tasks: state.tasks.map(t => t.date === today ? { ...t, done: true } : t),
      })),
    }),
    { name: 'task-storage', storage: AsyncStorage }
  )
);
