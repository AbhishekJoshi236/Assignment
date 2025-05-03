import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { DashboardStats, User } from '../../types';
import ComponentLoader from '../ui/ComponentLoader';

interface DashboardProps {
  stats: DashboardStats;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Show loading state briefly
    setIsLoading(true);
    
    // Simulate data loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!stats) return <div className="p-4">Loading...</div>;
  
  // Default priorities if not available in stats
  const priorities = {
    high: stats.priorities?.high || 0,
    medium: stats.priorities?.medium || 0,
    low: stats.priorities?.low || 0
  };
  
  const content = (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Habits Completed</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.habitsCompleted}/{stats.habitsTotal}
              </h3>
            </div>
            <span className="bg-blue-900 text-blue-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500"
              style={{ 
                width: `${stats.habitsTotal > 0 ? (stats.habitsCompleted / stats.habitsTotal) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Tasks Completed</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.tasksCompleted}/{stats.tasksTotal}
              </h3>
            </div>
            <span className="bg-green-900 text-green-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
              </svg>
            </span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ 
                width: `${stats.tasksTotal > 0 ? (stats.tasksCompleted / stats.tasksTotal) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Current Streak</p>
              <h3 className="text-2xl font-bold mt-1">{stats.currentStreak} days</h3>
            </div>
            <span className="bg-orange-900 text-orange-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Longest streak: {stats.longestStreak} days
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Weekly Progress</p>
              <h3 className="text-2xl font-bold mt-1">
                {Math.round((stats.weeklyProgress.reduce((acc, day) => acc + day.completed, 0) / 
                  stats.weeklyProgress.reduce((acc, day) => acc + day.total, 0)) * 100)}%
              </h3>
            </div>
            <span className="bg-purple-900 text-purple-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-2 flex">
            {stats.weeklyProgress.map((day) => (
              <div key={day.day} className="flex-1 space-y-1">
                <div className="h-12 relative">
                  <div 
                    className="absolute bottom-0 w-full bg-purple-900/30 rounded-sm"
                    style={{ height: `${(day.completed / day.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center text-gray-400">{day.day[0]}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Productivity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Productive Hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.productiveHours.filter((_, i) => i % 2 === 0)} // Show every other hour for clarity
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => value.split(':')[0]}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4B5563" />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Productivity']}
                  labelFormatter={(label) => `Hour: ${label}`}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorProductivity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Task Categories</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {stats.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} tasks`, props.payload.name]}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Task Priorities */}
      <motion.div 
        className="bg-gray-900 rounded-xl shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold mb-4">Task Priorities</h3>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-400">High Priority</span>
              <span className="text-sm text-gray-400">{priorities.high}/{stats.tasksTotal}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500"
                style={{ width: `${stats.tasksTotal > 0 ? (priorities.high / stats.tasksTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-400">Medium Priority</span>
              <span className="text-sm text-gray-400">{priorities.medium}/{stats.tasksTotal}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500"
                style={{ width: `${stats.tasksTotal > 0 ? (priorities.medium / stats.tasksTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-400">Low Priority</span>
              <span className="text-sm text-gray-400">{priorities.low}/{stats.tasksTotal}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${stats.tasksTotal > 0 ? (priorities.low / stats.tasksTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return <ComponentLoader isLoading={isLoading}>{content}</ComponentLoader>;
};

export default Dashboard; 