
import React from 'react';
import { SunIcon, MoonIcon, UserCircleIcon } from './icons/Icons';

interface HeaderProps {
  onThemeToggle: () => void;
  onLoginClick: () => void;
  theme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ onThemeToggle, onLoginClick, theme }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50 shadow-md dark:shadow-neon-purple/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-blue-500 via-neon-purple-500 to-warm-yellow-500 text-transparent bg-clip-text">
              PromoVídeo IA
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-purple-500 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full text-white bg-electric-blue-600 hover:bg-electric-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 transition-transform duration-200 hover:scale-105"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
