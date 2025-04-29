import create from 'zustand';
import dayjs from 'dayjs';

type Task = {
  id: string;
  text: string;
  date: string;
  time: string;
  done: boolean;
};

type State = {
  tasks: Task[];
  streak: number;
  longestStreak: number;
  lastCheckedDate: string;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearTodayTasks: (date: string) => void;
  checkStreak: () => void;
};

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  streak: 0,
  longestStreak: 0,
  lastCheckedDate: '',

  addTask: (task) => set(state => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set(state => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  toggleTask: (id) => set(state => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
  })),
  clearTodayTasks: (date) =>
    set(state => ({
      tasks: state.tasks.filter(t => t.date !== date),
    })),
  checkStreak: () => {
    const { tasks, streak, longestStreak, lastCheckedDate } = get();
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    // Avoid checking twice in one day
    if (lastCheckedDate === today) return;

    const yTasks = tasks.filter(t => t.date === yesterday);
    const allDone = yTasks.length > 0 && yTasks.every(t => t.done);

    let newStreak = allDone ? streak + 1 : 0;
    let newLongest = Math.max(longestStreak, newStreak);

    set({
      streak: newStreak,
      longestStreak: newLongest,
      lastCheckedDate: today,
    });
  },
}));
