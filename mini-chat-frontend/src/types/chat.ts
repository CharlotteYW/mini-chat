export interface Message {
  id: string;
  role: 'user' | 'assistant'
  content: string;
}

export interface Conversation {
    id: string
    title: string
    create_at: string
}

export interface ModelOption {
    label: string;
    model: string;
    provider: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
    { label: 'LLaMA 3.1 8B (Ollama)', model: 'llama3.1:8b', provider: 'ollama' },
    { label: 'LLaMA 3.1 8B (Groq)', model: 'llama-3.1-8b-instant', provider: 'groq' },
    { label: 'LLaMA 3.1 70B (Groq)', model: 'llama-3.3-70b-versatile', provider: 'groq' },
    { label: 'Gemma 2 9B (Groq)', model: 'gemma2-9b-it', provider: 'groq' },
];