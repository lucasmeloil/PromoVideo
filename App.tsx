
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { HistoryList } from './components/HistoryList';
import { generateVideo } from './services/geminiService';
import type { HistoryItem, FormState } from './types';
import { MALE_VOICES, FEMALE_VOICES, LOADING_MESSAGES } from './constants';
import { AuthModal } from './components/AuthModal';
import { ApiKeySelector } from './components/ApiKeySelector';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keySelected);
      } else {
        // Fallback for environments where aistudio is not available
        console.warn('window.aistudio not found. Assuming API key is set.');
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

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
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
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
        throw new Error("API_KEY environment variable not found. Please select an API Key.");
      }
      
      const response = await fetch(`${videoUri}&key=${apiKey}`);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Fetch video error:", errorBody);
        if (errorBody.includes('API key not valid') || errorBody.includes('Requested entity was not found')) {
            throw new Error('The selected API Key is not valid. Please select another key.');
        }
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
      
      let message = 'Ocorreu um erro desconhecido.';

      if (typeof err === 'string') {
        message = err;
      } else if (err && typeof err === 'object') {
        if (err.error?.message) { // Direct Gemini error object
            message = err.error.message;
        } else if (err.message) { // Standard Error object
            message = err.message;
        }
      }

      // The message itself could be a JSON string
      try {
        const parsedError = JSON.parse(message);
        if (parsedError.error?.message) {
          message = parsedError.error.message;
        }
      } catch (e) {
        // Not a JSON string, continue with the current message.
      }

      if (message.includes('Requested entity was not found') || message.includes('API key not valid')) {
        setError('A Chave de API é inválida ou não tem permissões. Por favor, selecione uma Chave de API válida para continuar.');
        setHasApiKey(false); // Force user to re-select the key
      } else if (message.includes('exceeded your current quota') || message.includes('RESOURCE_EXHAUSTED')) {
        setError(
          <>
            Você excedeu sua cota de uso. Verifique seu plano e faturamento e tente novamente mais tarde. Saiba mais na{' '}
            <a 
              href="https://ai.google.dev/gemini-api/docs/rate-limits" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline font-semibold hover:text-red-800"
            >
              documentação de limites de uso
            </a>.
          </>
        );
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (!hasApiKey) {
      return <ApiKeySelector onKeySelected={() => setHasApiKey(true)} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8">
          <div className="lg:col-span-1">
            <PromptForm onSubmit={handleGeneration} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            {isLoading && <LoadingIndicator messages={LOADING_MESSAGES} />}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert"><strong className="font-bold">Erro: </strong><span className="block sm:inline">{error}</span></div>}
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
