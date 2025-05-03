import React from 'react';
import Image from 'next/image';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: (type: 'addHabit' | 'addTask' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ user, isNavOpen, setIsNavOpen, openModal }) => {
  return (
    <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-black border-b border-gray-900">
      <button 
        className="md:hidden text-gray-300"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex-1 flex justify-center md:justify-start">
        <h1 className="text-xl font-semibold text-gray-100">Habit Tracker</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => openModal('settings')}
          className="text-gray-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-300 mr-2">{user.name}</span>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image 
              src={user.avatar} 
              alt={user.name} 
              width={32} 
              height={32}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 