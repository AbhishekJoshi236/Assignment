// Type definitions for the Habit Tracker application

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  color: string;
  streak: number;
  history: {
    date: string;
    completed: boolean;
  }[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface User {
  name: string;
  avatar: string;
  goals: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

export interface DashboardStats {
  habitsCompleted: number;
  habitsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  currentStreak: number;
  longestStreak: number;
  productiveHours: { hour: string; productivity: number }[];
  weeklyProgress: { day: string; completed: number; total: number }[];
  categories: { name: string; value: number; color: string }[];
  priorities?: {
    high: number;
    medium: number;
    low: number;
  };
} 