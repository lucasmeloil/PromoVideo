
import React from 'react';
import { AppleIcon, GoogleIcon, MailIcon, XIcon } from './icons/Icons';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative transform transition-all hover:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Faça login para acessar seu histórico de vídeos.</p>
        </div>
        <div className="mt-8 space-y-4">
          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <GoogleIcon className="w-5 h-5 mr-3" />
            Continuar com Google
          </button>
          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
            <AppleIcon className="w-5 h-5 mr-3" />
            Continuar com Apple
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou</span>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                 </div>
                 <input type="email" id="email" placeholder="seu@email.com" className="w-full pl-10 p-3 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple-500 focus:border-neon-purple-500 transition"/>
              </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-electric-blue-600 text-white font-semibold rounded-lg hover:bg-electric-blue-700 transition">
              Continuar com E-mail
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
