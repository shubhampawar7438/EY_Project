export interface Career {
  id: string;
  title: string;
  description: string;
  skills: string[];
  education: string[];
  salary: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  options?: string[];
  careers?: Career[];
}

export interface UserCareerPreferences {
  subjects: string[];
  hobbies: string[];
  strengths: string[];
  weaknesses: string[];
  workPreference: 'numbers' | 'people' | 'technology' | '';
}

export interface CareerSelection {
  userId: string;
  selectedCareers: string[];
  selectionMethod: 'chatbot' | 'manual';
  preferences?: UserCareerPreferences;
}