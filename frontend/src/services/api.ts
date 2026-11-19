/**
 * EduBridge AI - API Integration Service
 * Coordinates with:
 * - Spring Boot Backend (Auth, User Profile, Community Chat, Voice)
 * - FastAPI AI Service (Chatbot, Study Gap Recovery, Career Roadmap)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || '';
export const WS_URL =
  import.meta.env.VITE_WS_URL && String(import.meta.env.VITE_WS_URL).startsWith('ws')
    ? String(import.meta.env.VITE_WS_URL)
    : `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/ws`;

const TOKEN_KEY = 'edubridge_access_token';
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (err: unknown) {
    throw new Error('Cannot reach EduBridge backend on port 8080. Please ensure the backend is running.');
  }
  if (!response.ok) {
    const raw = await response.text().catch(() => '');
    let msg = raw;
    try {
      const parsed = JSON.parse(raw);
      msg = parsed.message || parsed.error || parsed.detail || raw;
    } catch {
      // Use raw text
    }
    throw new Error(msg || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export interface AuthResult {
  // Backend returns accessToken (not token), user.name (not displayName)
  accessToken: string;
  token?: string;        // alias for convenience
  tokenType?: string;
  user: { id: string; displayName?: string; name?: string; email: string; role: string };
}

export interface ChatChannel {
  id: string;
  name: string;
  type: string;
}

export interface ChatServer {
  id: string;
  name: string;
  description: string;
  channels: ChatChannel[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  editedAt?: string;
}

export interface AskAIRequest {
  message: string;
  history?: Array<{ role: 'user' | 'model'; text?: string; content?: string }>;
  contextNoteIds?: string[];
  userId?: string;
  systemPrompt?: string;
}

export interface AskAIResponse {
  success: boolean;
  answer: string;
  text?: string;
  provider?: string;
  model?: string;
  groundedSources?: string[];
  creditsAwarded?: number;
}

export const ApiService = {
  // ── Auth endpoints ──────────────────────────────────────────────────────────
  async login(credentials: { email: string; password: string }) {
    return request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(credentials: { displayName: string; email: string; password: string; role: string }) {
    return request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async fetchMe() {
    // Backend endpoint is /api/users/me
    return request<AuthResult['user']>('/users/me');
  },

  // ── Notes endpoints ──────────────────────────────────────────────────────────
  async fetchNotes() {
    try {
      return await request<unknown[]>('/notes');
    } catch {
      return null;
    }
  },

  // ── Community Chat endpoints ─────────────────────────────────────────────────
  async listServers() {
    return request<ChatServer[]>('/chat/servers');
  },

  async createServer(name: string, description = '') {
    return request<ChatServer>('/chat/servers', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async createChannel(serverId: string, name: string, type = 'TEXT') {
    return request<ChatChannel>(`/chat/servers/${serverId}/channels`, {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    });
  },

  async getMessages(channelId: string) {
    return request<ChatMessage[]>(`/chat/channels/${channelId}/messages`);
  },

  async sendMessage(channelId: string, content: string) {
    return request<ChatMessage>(`/chat/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteMessage(messageId: string) {
    return request<void>(`/chat/messages/${messageId}`, { method: 'DELETE' });
  },

  // ── Voice / LiveKit endpoints ────────────────────────────────────────────────
  async getVoiceToken(room: string) {
    return request<{ url: string; token: string }>('/voice/token', {
      method: 'POST',
      body: JSON.stringify({ room }),
    });
  },

  // ── AI Service endpoints (FastAPI on port 8000) ──────────────────────────────
  async askAI(req: AskAIRequest): Promise<AskAIResponse> {
    try {
      let endpoint = '/llm/chat';
      if (AI_SERVICE_URL) {
        const cleanBase = AI_SERVICE_URL.replace(/\/+$/, '');
        endpoint = cleanBase.endsWith('/llm') ? `${cleanBase}/chat` : `${cleanBase}/llm/chat`;
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: req.message,
          history: (req.history || []).map(h => ({ role: h.role, content: h.text || h.content || '' })),
          ...(req.systemPrompt ? { system_prompt: req.systemPrompt } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => '');
        throw new Error(err || `AI service error (${res.status})`);
      }
      return await res.json();
    } catch (error) {
      console.warn('AI service unreachable, using local fallback:', error);
      // Graceful fallback for demo / offline mode
      return {
        success: false,
        answer: 'The AI service is currently offline. Please start the AI service (ai-service/start.bat) and try again.',
        groundedSources: [],
      };
    }
  },
};
