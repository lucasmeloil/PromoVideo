
import React from 'react';
import { DownloadIcon, ShareIcon } from './icons/Icons';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Seu Vídeo Está Pronto!</h2>
      <div className="aspect-video bg-black rounded-xl overflow-hidden">
        <video src={src} controls autoPlay loop className="w-full h-full" />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <a
          href={src}
          download="promo-video.mp4"
          className="flex-1 flex items-center justify-center py-3 px-4 bg-electric-blue-600 text-white font-semibold rounded-xl hover:bg-electric-blue-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Baixar MP4
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex-1 flex items-center justify-center py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Compartilhar
        </button>
      </div>
    </div>
  );
};
