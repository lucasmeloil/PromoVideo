
import React from 'react';
import { HistoryCard } from './HistoryCard';
import type { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Histórico de Criações</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map(item => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
