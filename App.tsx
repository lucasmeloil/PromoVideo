
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { HistoryList } from './components/HistoryList';
import { ApiKeySelector } from './components/ApiKeySelector';
import { generateVideo } from './services/geminiService';
import type { HistoryItem, VoiceOption, FormState } from './types';
import { MALE_VOICES, FEMALE_VOICES, LOADING_MESSAGES } from './constants';
import { AuthModal } from './components/AuthModal';

// FIX: Define and use a named AIStudio interface to resolve conflicting global type declarations for window.aistudio.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
    try {
      const storedHistory = JSON.parse(localStorage.getItem('promoVideoHistory') || '[]');
      setHistory(storedHistory);
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      setHistory([]);
    }

    const checkApiKey = async () => {
      if (window.aistudio) {
        const keyStatus = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keyStatus);
      } else {
        // Fallback for local development or if aistudio is not available
        console.warn("aistudio not found, assuming API key is set via environment variable.");
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleKeySelected = () => {
    setHasApiKey(true);
  };

  const handleGeneration = async (formState: FormState) => {
    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const videoUri = await generateVideo(formState.prompt, formState.image);

      if (!videoUri) {
        throw new Error('Video generation failed to return a valid URI.');
      }
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY environment variable not found.");
      }
      
      const response = await fetch(`${videoUri}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      
      const videoBlob = await response.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        prompt: formState.prompt,
        imageUrl: formState.image,
        voice: MALE_VOICES.concat(FEMALE_VOICES).find(v => v.id === formState.voiceId)?.name || 'Unknown',
        videoUrl: videoUrl,
        createdAt: new Date().toISOString(),
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('promoVideoHistory', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || 'An unknown error occurred.';
      if (err.message && err.message.includes('Requested entity was not found')) {
        errorMessage = 'API Key not found or invalid. Please select a valid key.';
        setHasApiKey(false); // Reset to force re-selection
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (hasApiKey === null) {
      return <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300">Checking API Key...</div>;
    }
    if (!hasApiKey) {
      return <ApiKeySelector onKeySelected={handleKeySelected} />;
    }
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8">
          <div className="lg:col-span-1">
            <PromptForm onSubmit={handleGeneration} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            {isLoading && <LoadingIndicator messages={LOADING_MESSAGES} />}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}
            {generatedVideoUrl && !isLoading && <VideoPlayer src={generatedVideoUrl} />}
          </div>
        </div>
        <HistoryList history={history} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header onThemeToggle={handleThemeToggle} onLoginClick={() => setIsAuthModalOpen(true)} theme={theme} />
      <main className="container mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center p-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} PromoVídeo IA. All rights reserved.</p>
      </footer>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default App;