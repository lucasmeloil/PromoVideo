
import React from 'react';
import type { HistoryItem } from '../types';
import { ClockIcon, MicIcon, TextIcon } from './icons/Icons';


interface HistoryCardProps {
  item: HistoryItem;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-neon-purple/30 transition-all duration-300">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <img src={item.imageUrl} alt="Thumbnail" className="h-20 w-auto object-contain" />
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center truncate" title={item.prompt}>
            <TextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{item.prompt}</span>
        </p>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <MicIcon className="w-4 h-4 mr-1.5" />
            {item.voice}
          </span>
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};
