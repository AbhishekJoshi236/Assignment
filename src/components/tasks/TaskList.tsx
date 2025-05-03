import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../types';
import ConfirmDialog from '../ui/ConfirmDialog';
import ComponentLoader from '../ui/ComponentLoader';
import TaskCard from '../ui/TaskCard';
import { TaskListProps } from '../../types/proptypes';

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  toggleTaskCompletion, 
  deleteTask,
  updateTask,
  openModal 
}) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter and sort states
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'alphabetical'>('dueDate');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Task deletion state
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mass selection state
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  
  // Initialize loading
  useEffect(() => {
    // Show loading state briefly
    setIsLoading(true);
    
    // Simulate data loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get unique categories from tasks
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    tasks.forEach(task => uniqueCategories.add(task.category));
    return Array.from(uniqueCategories);
  }, [tasks]);
  
  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Filter by status
        if (filterStatus === 'active' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;
        
        // Filter by priority
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        
        // Filter by category
        if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
        
        // Filter by search query
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected criteria
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        if (sortBy === 'priority') {
          const priorityWeight = { low: 0, medium: 1, high: 2 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        
        // Alphabetical
        return a.title.localeCompare(b.title);
      });
  }, [tasks, filterStatus, filterPriority, selectedCategory, searchQuery, sortBy]);

  // Today's tasks
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredTasks.filter(task => !task.completed && task.dueDate === today);
  }, [filteredTasks]);
  
  // Upcoming tasks
  const upcomingTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredTasks.filter(task => !task.completed && task.dueDate > today);
  }, [filteredTasks]);
  
  // Overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredTasks.filter(task => !task.completed && task.dueDate < today);
  }, [filteredTasks]);
  
  // Completed tasks
  const completedTasks = useMemo(() => {
    return filteredTasks.filter(task => task.completed);
  }, [filteredTasks]);
  
  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
  };
  
  // Handle task edit
  const handleEditTask = (task: Task) => {
    // In a real implementation, this would open an edit modal
    // For now, let's programmatically update the task with a title change
    const updatedTitle = `${task.title} (updated)`;
    updateTask(task.id, { title: updatedTitle });
  };
  
  // Toggle selection of a task
  const toggleTaskSelection = (id: string) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };
  
  // Mark all selected tasks as complete
  const completeSelectedTasks = () => {
    selectedTasks.forEach(id => {
      const task = tasks.find(t => t.id === id);
      if (task && !task.completed) {
        toggleTaskCompletion(id);
      }
    });
    setSelectedTasks([]);
  };
  
  // Select all visible tasks
  const selectAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const content = (
    <div className="p-4 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button
          onClick={() => openModal('addTask')}
          className="flex items-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Task
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="bg-gray-900 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Status filter */}
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'active')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Priority filter */}
          <div className="md:w-48">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'alphabetical')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Batch actions */}
        {selectedTasks.length > 0 && (
          <motion.div 
            className="mt-4 p-3 bg-blue-900/50 rounded-lg flex justify-between items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-blue-200">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={completeSelectedTasks}
                className="py-1 px-3 bg-green-800 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Mark Complete
              </button>
              <button
                onClick={() => setSelectedTasks([])}
                className="py-1 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Selection actions */}
      {filteredTasks.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                onChange={selectAllTasks}
              />
              <span className="ml-2 text-sm text-gray-400">
                {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </label>
          </div>
          
          {selectedTasks.length === 0 && (
            <div className="text-sm text-gray-400">
              Tip: Click checkboxes to select multiple tasks
            </div>
          )}
        </div>
      )}
      
      {/* Task list */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-300 mb-1">No tasks found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? "Try adjusting your search or filters"
                : "Add your first task to get started"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Today's tasks */}
            {todayTasks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Today
                </h3>
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                      />
                    </div>
                    <div className="flex-grow">
                      <TaskCard 
                        task={task}
                        toggleTaskCompletion={toggleTaskCompletion}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Overdue tasks */}
            {overdueTasks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Overdue
                </h3>
                {overdueTasks.map(task => (
                  <div key={task.id} className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-red-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                      />
                    </div>
                    <div className="flex-grow">
                      <TaskCard 
                        task={task}
                        toggleTaskCompletion={toggleTaskCompletion}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upcoming tasks */}
            {upcomingTasks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Upcoming
                </h3>
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                      />
                    </div>
                    <div className="flex-grow">
                      <TaskCard 
                        task={task}
                        toggleTaskCompletion={toggleTaskCompletion}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Completed tasks - only show if filter is set to 'all' or 'completed' */}
            {completedTasks.length > 0 && (filterStatus === 'all' || filterStatus === 'completed') && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </h3>
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                      />
                    </div>
                    <div className="flex-grow">
                      <TaskCard 
                        task={task}
                        toggleTaskCompletion={toggleTaskCompletion}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );

  return <ComponentLoader isLoading={isLoading}>{content}</ComponentLoader>;
};

export default TaskList; 