import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Habit, Task, User, DashboardStats } from '../types';
import { 
  generateUser, 
  generateHabits, 
  generateTasks, 
  generateDashboardStats,
  COLORS
} from '../utils/mockData';

// Define the state shape
type AppState = {
  user: User;
  habits: Habit[];
  tasks: Task[];
  stats: DashboardStats | null;
  activeView: 'dashboard' | 'habits' | 'tasks';
  isModalOpen: boolean;
  modalType: 'addHabit' | 'addTask' | 'settings' | null;
  isNavOpen: boolean;
  newHabit: Partial<Habit>;
  newTask: Partial<Task>;
  settings: {
    notifications: boolean;
    weekStartsOn: string;
  };
};

// Define action types
type Action =
  | { type: 'SET_ACTIVE_VIEW'; payload: 'dashboard' | 'habits' | 'tasks' }
  | { type: 'TOGGLE_NAV' }
  | { type: 'OPEN_MODAL'; payload: 'addHabit' | 'addTask' | 'settings' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_NEW_HABIT'; payload: Partial<Habit> }
  | { type: 'SET_NEW_TASK'; payload: Partial<Task> }
  | { type: 'ADD_HABIT' }
  | { type: 'ADD_TASK' }
  | { type: 'TOGGLE_HABIT_COMPLETION'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'DELETE_TASK'; payload: string };

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Initial state
const today = new Date().toISOString().split('T')[0];

const initialState: AppState = {
  user: generateUser(),
  habits: [],
  tasks: [],
  stats: null,
  activeView: 'dashboard',
  isModalOpen: false,
  modalType: null,
  isNavOpen: false,
  newHabit: { 
    name: '', 
    frequency: 'daily', 
    color: COLORS[0] 
  },
  newTask: {
    title: '',
    dueDate: today,
    priority: 'medium',
    category: 'Personal',
  },
  settings: {
    notifications: true,
    weekStartsOn: 'Monday',
  },
};

// Reducer function
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    
    case 'TOGGLE_NAV':
      return { ...state, isNavOpen: !state.isNavOpen };
    
    case 'OPEN_MODAL':
      return { 
        ...state, 
        isModalOpen: true, 
        modalType: action.payload,
        // Reset form state when opening modal
        newHabit: action.payload === 'addHabit' ? 
          { name: '', frequency: 'daily', color: COLORS[0] } : 
          state.newHabit,
        newTask: action.payload === 'addTask' ? 
          { title: '', dueDate: today, priority: 'medium', category: 'Personal' } : 
          state.newTask
      };
    
    case 'CLOSE_MODAL':
      return { 
        ...state, 
        isModalOpen: false, 
        modalType: null,
      };
    
    case 'SET_NEW_HABIT':
      return { ...state, newHabit: { ...state.newHabit, ...action.payload } };
    
    case 'SET_NEW_TASK':
      return { ...state, newTask: { ...state.newTask, ...action.payload } };
    
    case 'ADD_HABIT': {
      if (!state.newHabit.name) return state;
      
      const newHabitFull: Habit = {
        id: Date.now().toString(),
        name: state.newHabit.name as string,
        frequency: state.newHabit.frequency as 'daily' | 'weekly',
        color: state.newHabit.color as string,
        streak: 0,
        history: [{ date: today, completed: false }],
      };
      
      const updatedHabits = [...state.habits, newHabitFull];
      
      return { 
        ...state, 
        habits: updatedHabits,
        stats: state.stats ? generateDashboardStats(updatedHabits, state.tasks) : null,
        isModalOpen: false,
        modalType: null,
      };
    }
    
    case 'ADD_TASK': {
      if (!state.newTask.title) return state;
      
      const newTaskFull: Task = {
        id: Date.now().toString(),
        title: state.newTask.title as string,
        completed: false,
        dueDate: state.newTask.dueDate as string,
        priority: state.newTask.priority as 'low' | 'medium' | 'high',
        category: state.newTask.category as string,
      };
      
      const updatedTasks = [...state.tasks, newTaskFull];
      
      return { 
        ...state, 
        tasks: updatedTasks,
        stats: state.stats ? generateDashboardStats(state.habits, updatedTasks) : null,
        isModalOpen: false,
        modalType: null,
      };
    }
    
    case 'TOGGLE_HABIT_COMPLETION': {
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === action.payload) {
          const lastHistoryIndex = habit.history.length - 1;
          if (lastHistoryIndex >= 0) {
            const updatedHistory = [...habit.history];
            updatedHistory[lastHistoryIndex] = {
              ...updatedHistory[lastHistoryIndex],
              completed: !updatedHistory[lastHistoryIndex].completed,
            };
            
            // Update streak
            let newStreak = 0;
            if (updatedHistory[lastHistoryIndex].completed) {
              newStreak = habit.streak + 1;
            } else {
              newStreak = Math.max(0, habit.streak - 1);
            }
            
            return {
              ...habit,
              history: updatedHistory,
              streak: newStreak,
            };
          }
        }
        return habit;
      });
      
      return { 
        ...state, 
        habits: updatedHabits,
        stats: state.stats ? generateDashboardStats(updatedHabits, state.tasks) : null
      };
    }
    
    case 'TOGGLE_TASK_COMPLETION': {
      const updatedTasks = state.tasks.map(task => {
        if (task.id === action.payload) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
      
      return { 
        ...state, 
        tasks: updatedTasks,
        stats: state.stats ? generateDashboardStats(state.habits, updatedTasks) : null
      };
    }
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'DELETE_HABIT': {
      const updatedHabits = state.habits.filter(habit => habit.id !== action.payload);
      
      return { 
        ...state, 
        habits: updatedHabits,
        stats: state.stats ? generateDashboardStats(updatedHabits, state.tasks) : null
      };
    }
    
    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      
      return { 
        ...state, 
        tasks: updatedTasks,
        stats: state.stats ? generateDashboardStats(state.habits, updatedTasks) : null
      };
    }
    
    default:
      return state;
  }
}

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Initialize data
  useEffect(() => {
    const initialHabits = generateHabits();
    const initialTasks = generateTasks();
    
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'dashboard' });
    
    // Update state directly for initialization
    state.habits = initialHabits;
    state.tasks = initialTasks;
    state.stats = generateDashboardStats(initialHabits, initialTasks);
  }, []);
  
  // Update localStorage when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('habit-tracker-settings', JSON.stringify(state.settings));
    }
  }, [state.settings]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 