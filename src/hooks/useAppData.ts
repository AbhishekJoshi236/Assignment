import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Habit, Task, DashboardStats } from '../types';
import { generateDashboardStats } from '../utils/mockData';

export function useAppData() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Update stats whenever habits or tasks change
  useEffect(() => {
    if (habits.length || tasks.length) {
      setStats(generateDashboardStats(habits, tasks));
    }
  }, [habits, tasks]);

  // Toggle habit completion
  const toggleHabitCompletion = useCallback((id: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === id) {
          const lastHistoryIndex = habit.history.length - 1;
          if (lastHistoryIndex >= 0) {
            const updatedHistory = [...habit.history];
            updatedHistory[lastHistoryIndex] = {
              ...updatedHistory[lastHistoryIndex],
              completed: !updatedHistory[lastHistoryIndex].completed,
            };
            
            // Update streak
            let newStreak = habit.streak;
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
      })
    );
  }, [setHabits]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  // Add new habit
  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'streak' | 'history'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      ...habit,
      streak: 0,
      history: [{ date: today, completed: false }],
    };
    
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  // Add new task
  const addTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      completed: false,
    };
    
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  // Delete habit
  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, [setHabits]);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  // Update habit
  const updateHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setHabits(prev => 
      prev.map(habit => habit.id === id ? { ...habit, ...updates } : habit)
    );
  }, [setHabits]);

  // Update task
  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => 
      prev.map(task => task.id === id ? { ...task, ...updates } : task)
    );
  }, [setTasks]);

  return {
    habits,
    tasks,
    stats,
    toggleHabitCompletion,
    toggleTaskCompletion,
    addHabit,
    addTask,
    deleteHabit,
    deleteTask,
    updateHabit,
    updateTask,
    setHabits,
    setTasks
  };
} 