import create from 'zustand';
import dayjs from 'dayjs';

export type Task = {
  id: string;
  text: string;
  time: string;
  date: string;
  done: boolean;
};

export type RecurringTask = {
  id: string;
  text: string;
  time: string;
  startDate: string;
  endDate: string;
  recurrence: 'daily' | 'weekly';
  weekDays?: number[];
};

export type CompletedRecurring = {
  id: string;
  date: string;
};

type State = {
  tasks: Task[];
  recurringTasks: RecurringTask[];
  completedRecurring: CompletedRecurring[];

  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  addRecurringTask: (task: Omit<RecurringTask, 'id'>) => void;
  deleteRecurringTask: (id: string) => void;
  toggleRecurring: (id: string, date: string) => void;

  getTasksForDate: (date: string) => {
    oneTime: Task[];
    recurring: (RecurringTask & { done: boolean })[];
  };

  getStreak: () => number;
};

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  recurringTasks: [],
  completedRecurring: [],

  addTask: (task) => set(state => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set(state => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  toggleTask: (id) => set(state => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  })),

  addRecurringTask: (task) => {
    const id = Date.now().toString();
    set(state => ({ recurringTasks: [...state.recurringTasks, { ...task, id }] }));
  },
  deleteRecurringTask: (id) => set(state => ({
    recurringTasks: state.recurringTasks.filter(t => t.id !== id),
    completedRecurring: state.completedRecurring.filter(c => c.id !== id),
  })),
  toggleRecurring: (id, date) => {
    const exists = get().completedRecurring.find(c => c.id === id && c.date === date);
    if (exists) {
      set(state => ({
        completedRecurring: state.completedRecurring.filter(c => !(c.id === id && c.date === date))
      }));
    } else {
      set(state => ({
        completedRecurring: [...state.completedRecurring, { id, date }]
      }));
    }
  },

  getTasksForDate: (date) => {
    const oneTime = get().tasks.filter(t => t.date === date);
    const recurring = get().recurringTasks
      .filter(r => {
        const isInRange = !dayjs(date).isBefore(r.startDate) && !dayjs(date).isAfter(r.endDate);
        const isDaily = r.recurrence === 'daily';
        const isWeekly = r.recurrence === 'weekly' && r.weekDays?.includes(dayjs(date).day());
        return isInRange && (isDaily || isWeekly);
      })
      .map(r => ({
        ...r,
        done: !!get().completedRecurring.find(c => c.id === r.id && c.date === date)
      }));
    return { oneTime, recurring };
  },

  getStreak: () => {
    const state = get();
    let streak = 0;
    for (let i = 0; ; i++) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const { oneTime, recurring } = state.getTasksForDate(date);
      const total = oneTime.length + recurring.length;
      const done =
        oneTime.filter(t => t.done).length +
        recurring.filter(r => state.completedRecurring.find(c => c.id === r.id && c.date === date)).length;

      if (total === 0) continue;
      if (done === total) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },
}));
