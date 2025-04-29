// app/store/taskStore.ts
import create from 'zustand';

interface Task {
  id: string;
  text: string;
  date: string;
  time: string;
  done: boolean;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearTodayTasks: (date: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ),
  })),
  clearTodayTasks: (date) => set((state) => ({
    tasks: state.tasks.filter((task) => task.date !== date),
  })),
}));
