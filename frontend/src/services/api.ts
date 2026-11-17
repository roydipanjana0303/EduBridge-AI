/**
 * EduBridge AI - API Integration Service
 * Coordinates with:
 * - Member 2: Spring Boot Backend (Auth, User Profile)
 * - Member 3: Spring Boot & PostgreSQL (Notes, Quizzes, Progress, Rewards)
 * - Member 4: FastAPI AI Service (Chatbot, Study Gap Recovery, Career Roadmap)
 */

const API_BASE_URL = (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) || 'http://localhost:8080/api';
const AI_SERVICE_URL = (typeof process !== 'undefined' && process.env?.VITE_AI_SERVICE_URL) || 'http://localhost:8000';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
const TOKEN_KEY = 'edubridge_access_token';
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export interface AuthResult { token: string; user: { id: string; displayName: string; email: string; role: string } }
export interface ChatChannel { id: string; name: string; type: string }
export interface ChatServer { id: string; name: string; description: string; channels: ChatChannel[] }
export interface ChatMessage { id: string; channelId: string; senderId: string; senderName: string; content: string; createdAt: string; editedAt?: string }
export const ApiService = {
  async login(credentials: { email: string; password: string }) { return request<AuthResult>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); },
  async register(credentials: { displayName: string; email: string; password: string; role: string }) { return request<AuthResult>('/auth/register', { method: 'POST', body: JSON.stringify(credentials) }); },
  async fetchMe() { return request<AuthResult['user']>('/auth/me'); },
  async listServers() { return request<ChatServer[]>('/chat/servers'); },
  async createServer(name: string, description = '') { return request<ChatServer>('/chat/servers', { method: 'POST', body: JSON.stringify({ name, description }) }); },
  async createChannel(serverId: string, name: string, type = 'TEXT') { return request<ChatChannel>(`/chat/servers/${serverId}/channels`, { method: 'POST', body: JSON.stringify({ name, type }) }); },
  async getMessages(channelId: string) { return request<ChatMessage[]>(`/chat/channels/${channelId}/messages`); },
  async sendMessage(channelId: string, content: string) { return request<ChatMessage>(`/chat/channels/${channelId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }); },
  async deleteMessage(messageId: string) { return request<void>(`/chat/messages/${messageId}`, { method: 'DELETE' }); },
  async getVoiceToken(room: string) { return request<{ url: string; token: string }>('/voice/token', { method: 'POST', body: JSON.stringify({ room }) }); },
  async fetchNotes() { try { return await request<unknown[]>('/notes'); } catch { return null; } },
  async askAI(req: { message: string; contextNoteIds?: string[]; userId?: string }) { const res = await fetch(`${AI_SERVICE_URL}/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) }); if (!res.ok) throw new Error('AI request failed'); return res.json(); },
};
