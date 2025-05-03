import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps } from '../../types/proptypes';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  modalType,
  newHabit,
  setNewHabit,
  newTask,
  setNewTask,
  settings,
  setSettings,
  addHabit,
  addTask
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [availableCategories] = useState<string[]>([
    'Work', 'Personal', 'Health', 'Learning', 'Home'
  ]);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Modal animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Generate title based on modal type
  const getModalTitle = () => {
    switch (modalType) {
      case 'addHabit':
        return 'Add New Habit';
      case 'addTask':
        return 'Add New Task';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  // Generate icon based on modal type
  const getModalIcon = () => {
    switch (modalType) {
      case 'addHabit':
        return (
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'addTask':
        return (
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get modal theme colors
  const getModalTheme = () => {
    switch (modalType) {
      case 'addHabit':
        return {
          icon: 'text-blue-500',
          accent: 'border-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          bg: 'bg-blue-900/10',
        };
      case 'addTask':
        return {
          icon: 'text-green-500',
          accent: 'border-green-500',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          bg: 'bg-green-900/10',
        };
      case 'settings':
        return {
          icon: 'text-purple-500',
          accent: 'border-purple-500',
          button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
          bg: 'bg-purple-900/10',
        };
      default:
        return {
          icon: 'text-gray-500',
          accent: 'border-gray-500',
          button: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          bg: 'bg-gray-900/10',
        };
    }
  };

  const theme = getModalTheme();

  // Render modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case 'addHabit':
        return (
          <motion.div className="space-y-4" variants={contentVariants}>
            <div>
              <label htmlFor="habitName" className="block text-sm font-medium text-gray-300 mb-1">
                Habit Name
              </label>
              <input
                type="text"
                id="habitName"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Morning Meditation"
              />
            </div>
            
            <div>
              <label htmlFor="habitFrequency" className="block text-sm font-medium text-gray-300 mb-1">
                Frequency
              </label>
              <select
                id="habitFrequency"
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="habitColor" className="block text-sm font-medium text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="habitColor"
                  value={newHabit.color}
                  onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                  className="h-10 w-10 border-0 rounded"
                />
                <span className="ml-2 text-sm text-gray-400">Choose a color for your habit</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`px-4 py-2 ${theme.button} text-white rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={addHabit}
                disabled={!newHabit.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add Habit
              </motion.button>
            </div>
          </motion.div>
        );
        
      case 'addTask':
        return (
          <motion.div className="space-y-4" variants={contentVariants}>
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Complete project proposal"
              />
            </div>
            
            <div>
              <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="taskDueDate"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-300 mb-1">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3 mt-1">
                {['low', 'medium', 'high'].map((priority) => (
                  <motion.button
                    key={priority}
                    type="button"
                    onClick={() => setNewTask({ ...newTask, priority: priority as 'low' | 'medium' | 'high' })}
                    className={`px-4 py-2 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 
                      ${newTask.priority === priority ? 
                        (priority === 'high' ? 'bg-red-900 text-red-100' : 
                         priority === 'medium' ? 'bg-yellow-900 text-yellow-100' : 
                                              'bg-green-900 text-green-100') :
                        'bg-gray-800 text-gray-400'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  id="taskCategory"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Work, Personal, Health"
                  list="category-options"
                />
                <datalist id="category-options">
                  {availableCategories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
                <div className="flex flex-wrap gap-1">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, category })}
                      className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`px-4 py-2 ${theme.button} text-white rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={addTask}
                disabled={!newTask.title}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add Task
              </motion.button>
            </div>
          </motion.div>
        );
        
      case 'settings':
        return (
          <motion.div className="space-y-4" variants={contentVariants}>
            <div className="flex items-center justify-between">
              <label htmlFor="notificationsToggle" className="text-sm font-medium text-gray-300">
                Enable Notifications
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="notificationsToggle"
                  checked={settings.notifications}
                  onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className="sr-only"
                />
                <div className="block bg-gray-700 w-12 h-6 rounded-full"></div>
                <div 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                    settings.notifications ? 'translate-x-6 bg-blue-500' : ''
                  }`}
                ></div>
              </div>
            </div>
            
            <div>
              <label htmlFor="weekStartsOn" className="block text-sm font-medium text-gray-300 mb-1">
                Week Starts On
              </label>
              <select
                id="weekStartsOn"
                value={settings.weekStartsOn}
                onChange={(e) => setSettings({ ...settings, weekStartsOn: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <motion.button
                className={`px-4 py-2 ${theme.button} text-white rounded-lg focus:outline-none focus:ring-2`}
                onClick={() => onClose()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Settings
              </motion.button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  // The actual modal component
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className={`${theme.bg} bg-gray-900 rounded-xl shadow-xl overflow-hidden max-w-md w-full border-t-4 ${theme.accent}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center mb-6">
                <motion.div 
                  className="mr-4 bg-gray-800 rounded-full p-3"
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {getModalIcon()}
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-xl font-bold text-gray-100"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {getModalTitle()}
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 text-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {modalType === 'addHabit' ? 'Create a new habit to track' : 
                     modalType === 'addTask' ? 'Add a new task to your list' : 
                     'Customize your app settings'}
                  </motion.p>
                </div>
                <motion.button
                  className="ml-auto text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-800"
                  onClick={onClose}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {renderModalContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal; 