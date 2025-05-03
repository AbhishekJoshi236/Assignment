import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '../../types';

interface HabitCardProps {
  habit: Habit;
  toggleHabitCompletion: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  toggleHabitCompletion, 
  onEdit, 
  onDelete,
  isSelected = false,
  onSelect
}) => {
  const [animateCompletion, setAnimateCompletion] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine if habit is completed today
  const isCompletedToday = habit.history.length > 0 && habit.history[habit.history.length - 1].completed;
  
  // Calculate habit completion rate
  const completionRate = habit.history.length === 0 
    ? 0 
    : Math.round((habit.history.filter(entry => entry.completed).length / habit.history.length) * 100);
  
  const handleCompletionToggle = () => {
    if (!isCompletedToday) {
      setAnimateCompletion(true);
      setTimeout(() => {
        toggleHabitCompletion(habit.id);
        setAnimateCompletion(false);
      }, 300);
    } else {
      toggleHabitCompletion(habit.id);
    }
  };

  // Get color based on streak length
  const getStreakColor = () => {
    if (habit.streak >= 30) return "text-purple-500";
    if (habit.streak >= 14) return "text-blue-500";
    if (habit.streak >= 7) return "text-cyan-500";
    return "text-orange-500";
  };

  // Get emoji for streak
  const getStreakEmoji = () => {
    if (habit.streak >= 30) return "🔥🔥🔥";
    if (habit.streak >= 14) return "🔥🔥";
    if (habit.streak >= 7) return "🔥";
    if (habit.streak >= 3) return "✨";
    return "";
  };

  // Calculate stroke dash array for progress circle
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = `${(completionRate * circumference) / 100} ${circumference}`;

  return (
    <motion.div 
      className={`bg-gray-900 rounded-xl shadow-sm overflow-hidden relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layoutId={`habit-${habit.id}`}
    >
      {/* Colorful top border based on habit's color */}
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: habit.color }}
      ></div>
      
      <div className="flex p-4 border-b border-gray-800">
        <div className="flex-1">
          <div className="flex items-center">
            {onSelect && (
              <motion.div 
                className="mr-2"
                whileTap={{ scale: 0.9 }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(habit.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-600 focus:ring-1"
                />
              </motion.div>
            )}
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: habit.color }}
            ></div>
            <h3 className="font-medium text-gray-200">{habit.name}</h3>
            {getStreakEmoji() && (
              <motion.span 
                className="ml-2 text-xs" 
                role="img" 
                aria-label="streak"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: habit.streak > 7 ? Infinity : 0, repeatDelay: 3 }}
              >
                {getStreakEmoji()}
              </motion.span>
            )}
          </div>
          <div className="flex items-center mt-2 ml-7 text-sm text-gray-400">
            <span className="mr-4 px-2 py-0.5 bg-gray-800 rounded-full text-xs">
              {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
            </span>
            <div className={`flex items-center ${getStreakColor()}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              <span>
                {habit.streak} day streak
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#374151" strokeWidth="3"></circle>
              <motion.circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke={isCompletedToday ? "#10B981" : habit.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ 
                  pathLength: completionRate / 100,
                  opacity: 1,
                  rotate: completionRate >= 100 ? 360 : 0
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeOut",
                  rotate: { repeat: completionRate >= 100 ? 1 : 0, duration: 0.7 }
                }}
              ></motion.circle>
              <text x="18" y="19" textAnchor="middle" fontSize="10" fill="#D1D5DB" fontWeight="bold">
                {completionRate}%
              </text>
            </svg>
            {completionRate >= 100 && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: 2 }}
              >
                <span role="img" aria-label="trophy" className="text-sm">🏆</span>
              </motion.div>
            )}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCompletionToggle}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isCompletedToday
                ? 'bg-green-900 text-green-300 hover:bg-green-800'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            aria-label={isCompletedToday ? "Mark incomplete" : "Mark complete"}
          >
            <AnimatePresence mode="wait">
              {animateCompletion && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-green-500 opacity-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {isCompletedToday ? (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  key="check"
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.svg>
              ) : (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="plus"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
          >
            <h4>Last 7 days</h4>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(habit)}
              className="p-1.5 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Edit habit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(habit.id)}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Delete habit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {habit.history.slice(-7).map((entry) => (
            <div 
              key={entry.date}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-xs
                ${entry.completed 
                  ? `bg-opacity-90 bg-green-900 text-green-300 ${entry.date === new Date().toISOString().split('T')[0] ? 'ring-2 ring-green-500' : ''}` 
                  : 'bg-gray-800 text-gray-400'
                }`}
            >
              {new Date(entry.date).getDate()}
            </div>
          ))}
        </div>
        
        {/* Additional habit details when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="text-gray-400 font-medium mb-1">Current Streak</h5>
                  <p className={`text-xl font-bold ${getStreakColor()}`}>
                    {habit.streak} days
                    <span className="ml-2 inline-block">
                      {getStreakEmoji()}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="text-gray-400 font-medium mb-1">Completion Rate</h5>
                  <p className="text-xl font-bold" style={{ color: habit.color }}>{completionRate}%</p>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 mb-3">
                <h5 className="text-gray-400 font-medium mb-2">Activity Stats</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Total Completions:</p>
                    <p className="font-medium text-gray-200">
                      {habit.history.filter(entry => entry.completed).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Entries:</p>
                    <p className="font-medium text-gray-200">{habit.history.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleCompletionToggle}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center
                    ${isCompletedToday
                      ? 'bg-red-900 text-red-100 hover:bg-red-800'
                      : 'bg-green-800 text-green-100 hover:bg-green-700'
                    }`}
                >
                  {isCompletedToday ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Unmark Today
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Complete Today
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HabitCard; 