import React, { useState, useEffect, useMemo } from 'react';
import { Habit } from '../../types';
import ConfirmDialog from '../ui/ConfirmDialog';
import ComponentLoader from '../ui/ComponentLoader';
import HabitCard from '../ui/HabitCard';
import { HabitsListProps } from '../../types/proptypes';
import { motion } from 'framer-motion';

const HabitsList: React.FC<HabitsListProps> = ({ 
  habits, 
  toggleHabitCompletion,
  deleteHabit,
  updateHabit,
  openModal 
}) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter and sort states
  const [filterFrequency, setFilterFrequency] = useState<'all' | 'daily' | 'weekly'>('all');
  const [sortBy, setSortBy] = useState<'streak' | 'alphabetical' | 'recent'>('recent');
  
  // Deletion confirmation
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mass completion
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  
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
  
  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    return habits
      .filter(habit => {
        // Filter by frequency
        if (filterFrequency !== 'all' && habit.frequency !== filterFrequency) return false;
        
        // Filter by search query
        if (searchQuery && !habit.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected criteria
        if (sortBy === 'streak') {
          return b.streak - a.streak;
        }
        
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        
        // Recent - assuming newer habits have higher IDs
        return parseInt(b.id) - parseInt(a.id);
      });
  }, [habits, filterFrequency, searchQuery, sortBy]);

  // Determine if habit is completed today
  const isHabitCompletedToday = (habit: Habit): boolean => {
    if (habit.history.length === 0) return false;
    const lastEntry = habit.history[habit.history.length - 1];
    return lastEntry.completed;
  };
  
  // Group habits by frequency
  const dailyHabits = useMemo(() => 
    filteredHabits.filter(habit => habit.frequency === 'daily')
  , [filteredHabits]);
  
  const weeklyHabits = useMemo(() =>
    filteredHabits.filter(habit => habit.frequency === 'weekly')
  , [filteredHabits]);
  
  // Handle habit deletion
  const handleDeleteHabit = (id: string) => {
    setHabitToDelete(id);
  };
  
  // Handle habit edit
  const handleEditHabit = (habit: Habit) => {
    // In a real implementation, this would open an edit modal
    // For now, let's programmatically update the habit with a name change
    const updatedName = `${habit.name} (updated)`;
    updateHabit(habit.id, { name: updatedName });
  };
  
  // Toggle selection of a habit
  const toggleHabitSelection = (id: string) => {
    if (selectedHabits.includes(id)) {
      setSelectedHabits(selectedHabits.filter(habitId => habitId !== id));
    } else {
      setSelectedHabits([...selectedHabits, id]);
    }
  };
  
  // Mark all selected habits as complete
  const completeSelectedHabits = () => {
    selectedHabits.forEach(id => {
      if (!isHabitCompletedToday(habits.find(h => h.id === id)!)) {
        toggleHabitCompletion(id);
      }
    });
    setSelectedHabits([]);
  };
  
  // Select all habits
  const selectAllHabits = () => {
    if (selectedHabits.length === filteredHabits.length) {
      setSelectedHabits([]);
    } else {
      setSelectedHabits(filteredHabits.map(habit => habit.id));
    }
  };

  const content = (
    <div className="p-4 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <button
          onClick={() => openModal('addHabit')}
          className="flex items-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Habit
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
                placeholder="Search habits..."
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
          
          {/* Frequency filter */}
          <div className="md:w-40">
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value as 'all' | 'daily' | 'weekly')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="md:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'streak' | 'alphabetical' | 'recent')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="streak">Highest Streak</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
        
        {/* Today's progress */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-200">Today&apos;s Progress</h3>
              <p className="text-sm text-gray-400">
                {habits.filter(h => isHabitCompletedToday(h)).length} of {habits.length} habits completed
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600"
                style={{ 
                  width: `${habits.length > 0 ? (habits.filter(h => isHabitCompletedToday(h)).length / habits.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Batch actions */}
        {selectedHabits.length > 0 && (
          <motion.div 
            className="mt-4 p-3 bg-blue-900/50 rounded-lg flex justify-between items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-blue-200">
              {selectedHabits.length} habit{selectedHabits.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={completeSelectedHabits}
                className="py-1 px-3 bg-green-800 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Mark Complete
              </button>
              <button
                onClick={() => setSelectedHabits([])}
                className="py-1 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Selection actions */}
      {filteredHabits.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                checked={selectedHabits.length === filteredHabits.length && filteredHabits.length > 0}
                onChange={selectAllHabits}
              />
              <span className="ml-2 text-sm text-gray-400">
                {selectedHabits.length === filteredHabits.length && filteredHabits.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </label>
          </div>
          
          {selectedHabits.length === 0 && (
            <motion.div 
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tip: Click checkboxes to select multiple habits
            </motion.div>
          )}
        </div>
      )}
      
      {/* Habits lists by frequency */}
      <div className="space-y-6">
        {/* Daily Habits */}
        {dailyHabits.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Daily Habits
            </h3>
            
            <div className="space-y-4">
              {dailyHabits.map((habit) => (
                <div key={habit.id} className="flex items-center">
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                      checked={selectedHabits.includes(habit.id)}
                      onChange={() => toggleHabitSelection(habit.id)}
                    />
                  </div>
                  <div className="flex-grow">
                    <HabitCard 
                      habit={habit}
                      toggleHabitCompletion={toggleHabitCompletion}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Weekly Habits */}
        {weeklyHabits.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Weekly Habits
            </h3>
            
            <div className="space-y-4">
              {weeklyHabits.map((habit) => (
                <div key={habit.id} className="flex items-center">
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                      checked={selectedHabits.includes(habit.id)}
                      onChange={() => toggleHabitSelection(habit.id)}
                    />
                  </div>
                  <div className="flex-grow">
                    <HabitCard 
                      habit={habit}
                      toggleHabitCompletion={toggleHabitCompletion}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {filteredHabits.length === 0 && (
          <div className="bg-gray-900 rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400">No habits found</p>
            <button
              onClick={() => openModal('addHabit')}
              className="mt-4 inline-flex items-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Habit
            </button>
          </div>
        )}
      </div>
      
      {/* Confirmation dialog for habit deletion */}
      <ConfirmDialog
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={() => {
          if (habitToDelete) {
            deleteHabit(habitToDelete);
            setHabitToDelete(null);
          }
        }}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This will erase all history and streak data."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );

  return <ComponentLoader isLoading={isLoading}>{content}</ComponentLoader>;
};

export default HabitsList; 