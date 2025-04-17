
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="text-center mb-6 relative">
      <div className="absolute right-0 top-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>
      </div>
      <div className="flex justify-center items-center mb-2">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">😊</span>
        </div>
      </div>
      <h1 className="text-2xl font-semibold dark:text-gray-100 text-gray-800">Sentiment Analysis</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Analyze the sentiment of your text</p>
    </header>
  );
};

export default Header;
