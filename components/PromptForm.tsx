
import React, { useState, useCallback } from 'react';
import { MALE_VOICES, FEMALE_VOICES } from '../constants';
import type { FormState } from '../types';
import { SparklesIcon, UploadIcon, WandIcon } from './icons/Icons';

interface PromptFormProps {
  onSubmit: (formState: FormState) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/*;base64, prefix
        resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
  });


export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState(MALE_VOICES[0].id);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !image) {
      alert('Por favor, preencha o prompt e anexe uma imagem.');
      return;
    }
    const imageBase64 = await fileToBase64(image);
    onSubmit({ prompt, image: imageBase64, voiceId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-2xl space-y-6 border border-gray-200 dark:border-gray-700"
    >
      <div>
        <label htmlFor="prompt" className="block text-lg font-semibold mb-2 flex items-center">
          <WandIcon className="w-5 h-5 mr-2 text-neon-purple-500" />
          Seu Prompt Mágico
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Crie uma propaganda animada para uma pizzaria com voz masculina jovem e trilha pop..."
          rows={5}
          className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-neon-purple-500 focus:border-neon-purple-500 transition"
          required
        />
      </div>

      <div>
        <label htmlFor="image-upload" className="block text-lg font-semibold mb-2 flex items-center">
          <UploadIcon className="w-5 h-5 mr-2 text-electric-blue-500" />
          Logotipo ou Mascote
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-lg" />
            ) : (
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label htmlFor="image-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-electric-blue-600 dark:text-electric-blue-400 hover:text-electric-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-electric-blue-500">
                <span>Carregar arquivo</span>
                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept=".jpg,.jpeg,.png,.svg" onChange={handleImageChange} required />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, SVG até 10MB</p>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="voice" className="block text-lg font-semibold mb-2">Voz da Narração</label>
        <select
          id="voice"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-neon-purple-500 focus:border-neon-purple-500 transition"
        >
          <optgroup label="Vozes Masculinas">
            {MALE_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
          </optgroup>
          <optgroup label="Vozes Femininas">
            {FEMALE_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
          </optgroup>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-electric-blue-600 to-neon-purple-600 hover:from-electric-blue-700 hover:to-neon-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-purple-500"
      >
        <SparklesIcon className="w-6 h-6 mr-3" />
        {isLoading ? 'Gerando Mágica...' : 'Gerar Vídeo'}
      </button>

       <div className="text-center p-4 mt-4 bg-warm-yellow-100 dark:bg-warm-yellow-900/30 rounded-lg">
        <p className="font-bold text-warm-yellow-800 dark:text-warm-yellow-200">Plano Premium</p>
        <p className="text-sm text-warm-yellow-700 dark:text-warm-yellow-300">Acesso a todas as vozes e exportação em alta resolução.</p>
        <button className="mt-2 text-sm font-semibold text-electric-blue-600 dark:text-electric-blue-400 hover:underline">Faça Upgrade</button>
      </div>

    </form>
  );
};
