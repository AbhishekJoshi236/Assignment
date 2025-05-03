import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  toggleTaskCompletion, 
  onEdit, 
  onDelete,
  isSelected = false,
  onSelect
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [animateCompletion, setAnimateCompletion] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateString === today) return 'Today';
    if (dateString === tomorrowStr) return 'Tomorrow';
    
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: new Date(dateString).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isPastDue = new Date(task.dueDate) < new Date(new Date().toISOString().split('T')[0]) && !task.completed;
  const formattedDate = formatDate(task.dueDate);
  const dueInDays = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const priorityColors = {
    high: {
      bg: 'bg-red-900',
      text: 'text-red-300',
      hover: 'hover:bg-red-800',
      border: 'border-red-600',
      light: 'bg-red-900/30',
      gradient: 'from-red-900/50 to-red-900/10'
    },
    medium: {
      bg: 'bg-yellow-900',
      text: 'text-yellow-300',
      hover: 'hover:bg-yellow-800',
      border: 'border-yellow-600',
      light: 'bg-yellow-900/30',
      gradient: 'from-yellow-900/50 to-yellow-900/10'
    },
    low: {
      bg: 'bg-green-900',
      text: 'text-green-300',
      hover: 'hover:bg-green-800',
      border: 'border-green-600',
      light: 'bg-green-900/30',
      gradient: 'from-green-900/50 to-green-900/10'
    }
  };

  const handleCompletionToggle = () => {
    if (!task.completed) {
      setAnimateCompletion(true);
      setTimeout(() => {
        toggleTaskCompletion(task.id);
        setAnimateCompletion(false);
      }, 300);
    } else {
      toggleTaskCompletion(task.id);
    }
  };
  
  // Generate urgency badge based on due date
  const getUrgencyBadge = () => {
    if (task.completed) return null;
    
    if (isPastDue) {
      return (
        <span 
          className="absolute top-2 right-16 px-2 py-0.5 bg-red-900/60 text-red-300 text-xs rounded-full border border-red-700"
        >
          <span className="inline-block mr-1 animate-pulse">⚠️</span>
          Overdue
        </span>
      );
    }
    
    if (dueInDays === 0) {
      return (
        <span 
          className="absolute top-2 right-16 px-2 py-0.5 bg-yellow-900/60 text-yellow-300 text-xs rounded-full border border-yellow-700"
        >
          <span className="inline-block mr-1">⏰</span>
          Due Today
        </span>
      );
    }
    
    if (dueInDays === 1) {
      return (
        <span 
          className="absolute top-2 right-16 px-2 py-0.5 bg-yellow-900/60 text-yellow-300 text-xs rounded-full border border-yellow-700"
        >
          <span className="inline-block mr-1">📆</span>
          Due Tomorrow
        </span>
      );
    }
    
    if (dueInDays <= 3) {
      return (
        <span 
          className="absolute top-2 right-16 px-2 py-0.5 bg-blue-900/60 text-blue-300 text-xs rounded-full border border-blue-700"
        >
          <span className="inline-block mr-1">🔔</span>
          Due Soon
        </span>
      );
    }
    
    return null;
  };

  return (
    <motion.div 
      className={`bg-gray-900 rounded-xl shadow-sm overflow-hidden mb-3 relative ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isPastDue ? 'border-l-4 border-red-600' : 
          task.completed ? 'border-l-4 border-green-600' : 
          `border-l-4 ${priorityColors[task.priority].border}`}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      layoutId={`task-${task.id}`}
      onHoverStart={() => setShowOptions(true)}
      onHoverEnd={() => setShowOptions(false)}
    >
      {task.completed && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-transparent pointer-events-none"
        />
      )}
      
      {!task.completed && !isPastDue && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${priorityColors[task.priority].gradient} pointer-events-none`}
        />
      )}
      
      {getUrgencyBadge()}
      
      <div className="flex items-center p-4">
        <div className="relative">
          {onSelect && (
            <div className="mr-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(task.id)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-600 focus:ring-1"
              />
            </div>
          )}
          {!onSelect && (
            <button
              onClick={handleCompletionToggle}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 shrink-0 transition-all
                ${task.completed 
                  ? 'bg-green-900 border-green-700 text-green-300' 
                  : `border-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-600 bg-transparent 
                    hover:bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-900/30`
                }`}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              <AnimatePresence mode="wait">
                {animateCompletion && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-green-500 opacity-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 3, opacity: 0 }}
                    exit={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {task.completed && (
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
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
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}
            style={{ 
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {task.title}
          </h3>
          <div className="flex items-center mt-1 flex-wrap gap-1">
            <span 
              className={`text-xs px-2 py-1 rounded-full mr-2 ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className="text-xs text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
              {isPastDue && (
                <span 
                  className="text-red-400 ml-1 font-semibold"
                >
                  (Overdue)
                </span>
              )}
            </span>
            <span 
              className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded-full ml-0 md:ml-2"
            >
              {task.category}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2 z-10">
          {(!task.completed || (task.completed && showOptions)) && (
            <>
              {!task.completed && (
                <button 
                  onClick={() => onEdit(task)}
                  className="p-2 text-gray-400 hover:text-blue-400 rounded hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-blue-400 rounded hover:bg-gray-800 transition-colors"
              >
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-400 rounded hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
          {task.completed && !showOptions && (
            <div 
              className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded-full flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </div>
          )}
        </div>
      </div>
      
      {/* Expandable details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="pt-2 border-t border-gray-800 mt-2">
              <div className="bg-gray-800 rounded-lg p-3 mt-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Task Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Priority:</p>
                    <p className={`font-medium ${priorityColors[task.priority].text}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Category:</p>
                    <p className="font-medium text-gray-300">{task.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Due Date:</p>
                    <p className={`font-medium ${isPastDue ? 'text-red-400' : 'text-gray-300'}`}>
                      {formattedDate} 
                      {dueInDays > 0 && !task.completed && !isPastDue && (
                        <span className="text-xs text-gray-400 ml-1">
                          (in {dueInDays} {dueInDays === 1 ? 'day' : 'days'})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-1.5 ${
                        task.completed ? 'bg-green-500' : 
                        isPastDue ? 'bg-red-500 animate-pulse' : 
                        dueInDays <= 1 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <p className={`font-medium ${
                        task.completed ? 'text-green-400' : 
                        isPastDue ? 'text-red-400' : 
                        dueInDays <= 1 ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {task.completed ? 'Completed' : isPastDue ? 'Overdue' : dueInDays <= 1 ? 'Urgent' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 mt-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Timeline</h4>
                <div className="flex items-center">
                  <div className={`h-full flex-1 ${!task.completed ? 'bg-gray-700' : 'bg-green-900/30'} rounded-full h-2 overflow-hidden`}>
                    <motion.div
                      className={`h-full ${
                        isPastDue ? 'bg-red-600' : 
                        dueInDays === 0 ? 'bg-yellow-600' : 
                        dueInDays <= 3 ? 'bg-blue-600' : 'bg-green-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: task.completed ? '100%' : isPastDue ? '100%' : `${Math.min(100, Math.max(5, (100 - dueInDays * 10)))}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              
              {!task.completed && (
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCompletionToggle}
                    className="px-3 py-1.5 bg-green-800 hover:bg-green-700 text-green-200 text-sm rounded-full transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard; 