/**
 * EduBridge AI - API Integration Service
 * Coordinates with:
 * - Member 2: Spring Boot Backend (Auth, User Profile)
 * - Member 3: Spring Boot & PostgreSQL (Notes, Quizzes, Progress, Rewards)
 * - Member 4: FastAPI AI Service (Chatbot, Study Gap Recovery, Career Roadmap)
 */

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8080/api';
const AI_SERVICE_URL = (import.meta.env?.VITE_AI_SERVICE_URL as string) || 'http://localhost:8000';

export interface AskAIRequest {
  message: string;
  contextNoteIds?: string[];
  userId?: string;
}

export interface AskAIResponse {
  answer: string;
  groundedSources?: string[];
  creditsAwarded?: number;
}

export const ApiService = {
  // Auth endpoints (Member 2)
  async login(credentials: { email?: string; password?: string; role?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch {
      // Fallback for hackathon demo offline mode
      return { token: 'mock-jwt-token', user: { name: 'Aarav', role: credentials.role || 'Student' } };
    }
  },

  // Notes endpoints (Member 3)
  async fetchNotes() {
    try {
      const res = await fetch(`${API_BASE_URL}/notes`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      return await res.json();
    } catch {
      return null;
    }
  },

  // AI Chat & Grounded Question Answering (Member 4)
  async askAI(req: AskAIRequest): Promise<AskAIResponse> {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error('AI request failed');
      return await res.json();
    } catch {
      return {
        answer: 'Processed query using local academic knowledge base.',
        groundedSources: ['Newton’s Laws summary'],
      };
    }
  },
};
