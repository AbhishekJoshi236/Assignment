import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeView: 'dashboard' | 'habits' | 'tasks';
  setActiveView: React.Dispatch<React.SetStateAction<'dashboard' | 'habits' | 'tasks'>>;
  isNavOpen: boolean;
  openModal: (type: 'addHabit' | 'addTask' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isNavOpen, 
  openModal 
}) => {
  return (
    <motion.nav 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-black shadow-lg transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:w-64 md:shrink-0`}
      initial={false}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="mb-8 flex items-center justify-center p-4">
          <h2 className="text-xl font-bold text-gray-100">Personal Analytics</h2>
        </div>
        
        <ul className="space-y-2 flex-1">
          <li>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full py-3 px-4 rounded-lg flex items-center transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-gray-800 text-blue-400' 
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('habits')}
              className={`w-full py-3 px-4 rounded-lg flex items-center transition-colors ${
                activeView === 'habits' 
                  ? 'bg-gray-800 text-blue-400' 
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Habits
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('tasks')}
              className={`w-full py-3 px-4 rounded-lg flex items-center transition-colors ${
                activeView === 'tasks' 
                  ? 'bg-gray-800 text-blue-400' 
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
              </svg>
              Tasks
            </button>
          </li>
        </ul>
        
        <div className="mt-auto">
          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => openModal('addHabit')}
                className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Habit
              </button>
              
              <button
                onClick={() => openModal('addTask')}
                className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar; 