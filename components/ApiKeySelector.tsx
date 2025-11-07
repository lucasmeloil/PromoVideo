
import React, { useState } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Assume success after the dialog is closed to handle potential race conditions.
        onKeySelected();
      } else {
        throw new Error("API key selection utility is not available.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred while opening the API key selector.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API Key Necessária</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Para usar a geração de vídeo Veo, você precisa selecionar uma chave de API do Google AI Studio. Isso habilitará o acesso ao modelo de IA.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-electric-blue-600 text-white font-semibold rounded-xl hover:bg-electric-blue-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500"
        >
          Selecionar Chave de API
        </button>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            A cobrança pode ser aplicada. Para mais informações, consulte a{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-electric-blue-400">
            documentação de cobrança
          </a>.
        </p>
      </div>
    </div>
  );
};
