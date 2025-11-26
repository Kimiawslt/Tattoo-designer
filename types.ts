export interface Preference {
  id: string;
  label: string;
  active: boolean;
}

export interface GenerationState {
  status: 'idle' | 'uploading' | 'generating' | 'success' | 'error';
  message?: string;
}

export interface TattooRequest {
  image: string; // Base64
  preferences: string[];
  additionalNotes?: string;
}