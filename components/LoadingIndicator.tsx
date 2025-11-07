
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/Icons';

interface LoadingIndicatorProps {
  messages: string[];
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-electric-blue-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-purple-500">
           <SparklesIcon className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Criando seu vídeo...</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 min-h-[40px]">
          {messages[currentMessageIndex]}
        </p>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Isso pode levar alguns minutos. Vale a pena esperar!</p>
      </div>
    </div>
  );
};
