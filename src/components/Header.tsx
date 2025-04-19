import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Twitter } from 'lucide-react';
import { format } from 'date-fns';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const currentTime = format(new Date(), "hh:mm a");

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Twitter className="h-6 w-6" />
          TweetSense
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-300">{currentTime}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-gray-600" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-gray-300" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;