
export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
}

export interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  voice: string;
  videoUrl: string;
  createdAt: string;
}

export interface FormState {
  prompt: string;
  image: string; // base64
  voiceId: string;
}
