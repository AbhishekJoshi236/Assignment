// Mock data generators for the Habit Tracker application
import { Habit, Task, User, DashboardStats } from '../types';

// Color palette for the application
export const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

export const generateUser = (): User => ({
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  goals: [
    { name: 'Read Books', target: 24, current: 6, unit: 'books' },
    { name: 'Exercise', target: 150, current: 78, unit: 'hours' },
    { name: 'Learn Spanish', target: 365, current: 120, unit: 'days' },
  ],
});

export const generateHabits = (): Habit[] => {
  const habits: Habit[] = [
    {
      id: '1',
      name: 'Morning Meditation',
      frequency: 'daily',
      color: COLORS[0],
      streak: 5,
      history: [],
    },
    {
      id: '2',
      name: 'Exercise',
      frequency: 'daily',
      color: COLORS[1],
      streak: 3,
      history: [],
    },
    {
      id: '3',
      name: 'Read 30 minutes',
      frequency: 'daily',
      color: COLORS[2],
      streak: 7,
      history: [],
    },
    {
      id: '4',
      name: 'Weekly Review',
      frequency: 'weekly',
      color: COLORS[3],
      streak: 2,
      history: [],
    },
    {
      id: '5',
      name: 'No Social Media',
      frequency: 'daily',
      color: COLORS[4],
      streak: 1,
      history: [],
    },
  ];

  // Generate history for the past 30 days
  const today = new Date();
  for (const habit of habits) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // For weekly habits, only include if it's the same day of week as today
      if (habit.frequency === 'weekly' && date.getDay() !== today.getDay()) {
        continue;
      }
      
      // Randomly decide if habit was completed with higher probability for more recent dates
      const recencyFactor = 1 - (i / 40); // 1 to 0.25
      const streakFactor = Math.min(habit.streak / 10, 0.5); // 0 to 0.5
      const completed = Math.random() < (0.7 * recencyFactor + streakFactor);
      
      habit.history.push({
        date: dateStr,
        completed,
      });
    }
    // Sort history by date ascending
    habit.history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  return habits;
};

export const generateTasks = (): Task[] => {
  const categories = ['Work', 'Personal', 'Health', 'Learning', 'Home'];
  const tasks: Task[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const daysOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysOffset);
    
    const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
    const category = categories[Math.floor(Math.random() * categories.length)];
    const completed = Math.random() > 0.6;
    
    tasks.push({
      id: i.toString(),
      title: `Task ${i}: ${category} - ${priority} priority`,
      completed,
      dueDate: dueDate.toISOString().split('T')[0],
      priority,
      category,
    });
  }
  
  return tasks;
};

export const generateDashboardStats = (habits: Habit[], tasks: Task[]): DashboardStats => {
  const habitsCompleted = habits.reduce((acc, h) => acc + (h.history.length > 0 && h.history[h.history.length - 1].completed ? 1 : 0), 0);
  const tasksCompleted = tasks.filter(t => t.completed).length;
  
  // Productive hours mock data
  const productiveHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;
    const baseProductivity = i >= 8 && i <= 18 ? Math.random() * 70 + 30 : Math.random() * 30;
    return { hour, productivity: Math.floor(baseProductivity) };
  });
  
  // Weekly progress
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyProgress = days.map(day => ({
    day,
    completed: Math.floor(Math.random() * 8),
    total: 8 + Math.floor(Math.random() * 4),
  }));
  
  // Categories
  const categoryMap = new Map<string, number>();
  tasks.forEach(task => {
    categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
  });
  
  const categories = Array.from(categoryMap.entries()).map(([name, count], index) => ({
    name,
    value: count,
    color: COLORS[index % COLORS.length],
  }));
  
  // Task priorities
  const priorities = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };
  
  return {
    habitsCompleted,
    habitsTotal: habits.length,
    tasksCompleted,
    tasksTotal: tasks.length,
    currentStreak: 5,
    longestStreak: 12,
    productiveHours,
    weeklyProgress,
    categories,
    priorities
  };
}; 