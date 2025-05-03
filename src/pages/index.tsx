import React, { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';

// Components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';
import HabitsList from '../components/habits/HabitsList';
import TaskList from '../components/tasks/TaskList';
import Modal from '../components/ui/Modal';
import AppLoader from '../components/ui/AppLoader';

// Hooks and Context
import { useAppData } from '../hooks/useAppData';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Types 
import { User } from '../types';
import { generateUser } from '../utils/mockData';
import { 
  HabitFormState, 
  TaskFormState, 
  SettingsState, 
  ModalType 
} from '../types/proptypes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function HabitTracker() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Use custom hooks for data management
  const { 
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
  } = useAppData();
  
  // User data with localStorage persistence
  const [user] = useLocalStorage<User>('user', generateUser());
  
  // UI state
  const [activeView, setActiveView] = useState<'dashboard' | 'habits' | 'tasks'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<HabitFormState>({
    name: '',
    frequency: 'daily',
    color: '#8884d8',
  });
  const [newTask, setNewTask] = useState<TaskFormState>({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: 'Personal',
  });
  const [settings, setSettings] = useLocalStorage<SettingsState>('settings', {
    notifications: true,
    weekStartsOn: 'Monday',
  });
  
  // Load initial data from localStorage if available
  useEffect(() => {
    // If the app is freshly loaded and no data exists yet, initialize with mock data
    const loadInitialData = async () => {
      setIsLoading(true);
      
      if (typeof window !== 'undefined' && !localStorage.getItem('habits') && !localStorage.getItem('tasks')) {
        // Import is dynamic to avoid SSR issues with localStorage
        const { generateHabits, generateTasks } = await import('../utils/mockData');
        setHabits(generateHabits());
        setTasks(generateTasks());
      }
      
      // Wait for a minimum time to avoid flickering
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setInitialLoadComplete(true);
    };
    
    if (!initialLoadComplete) {
      loadInitialData();
    }
  }, [setHabits, setTasks, initialLoadComplete]);
  
  // Functions
  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalType(null), 300); // Wait for animation to complete
    
    // Reset form state
    setNewHabit({ 
      name: '', 
      frequency: 'daily', 
      color: '#8884d8'
    });
    
    setNewTask({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      category: 'Personal',
    });
  };
  
  const handleAddHabit = () => {
    if (!newHabit.name) return;
    
    addHabit({
      name: newHabit.name,
      frequency: newHabit.frequency,
      color: newHabit.color,
    });
    
    closeModal();
  };
  
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    addTask({
      title: newTask.title,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      category: newTask.category,
    });
    
    closeModal();
  };
  
  const handleUpdateSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    closeModal();
  };

  return (
    <AppLoader isLoading={isLoading && !initialLoadComplete}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-black text-gray-100`}
      >
        <Head>
          <title>Personal Analytics & Habit Tracker</title>
          <meta name="description" content="Track your habits and personal analytics" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            activeView={activeView}
            setActiveView={setActiveView}
            isNavOpen={isNavOpen}
            openModal={openModal}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              user={user}
              isNavOpen={isNavOpen}
              setIsNavOpen={setIsNavOpen}
              openModal={openModal}
            />
            
            <main className="flex-1 overflow-y-auto bg-black">
              {activeView === 'dashboard' && stats && <Dashboard stats={stats} user={user} />}
              {activeView === 'habits' && (
                <HabitsList 
                  habits={habits} 
                  toggleHabitCompletion={toggleHabitCompletion} 
                  deleteHabit={deleteHabit}
                  updateHabit={updateHabit}
                  openModal={openModal} 
                />
              )}
              {activeView === 'tasks' && (
                <TaskList 
                  tasks={tasks} 
                  toggleTaskCompletion={toggleTaskCompletion} 
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  openModal={openModal} 
                />
              )}
            </main>
          </div>
        </div>
        
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalType={modalType}
          newHabit={newHabit}
          setNewHabit={setNewHabit}
          newTask={newTask}
          setNewTask={setNewTask}
          settings={settings}
          setSettings={handleUpdateSettings}
          addHabit={handleAddHabit}
          addTask={handleAddTask}
        />
      </div>
    </AppLoader>
  );
}
