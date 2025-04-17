
import React from 'react';

const Header = () => {
  return (
    <header className="text-center mb-6">
      <div className="flex justify-center items-center mb-2">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">😊</span>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">Sentiment Analysis</h1>
      <p className="text-gray-500 text-sm mt-1">Analyze the sentiment of your text</p>
    </header>
  );
};

export default Header;
