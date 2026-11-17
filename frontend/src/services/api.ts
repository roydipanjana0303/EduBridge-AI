
import {
  AuthResponse,
  BackendUser,
  UserProfile,
} from '../types';
import { StorageService } from './storage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const AI_SERVICE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

function mapBackendUser(user: BackendUser): UserProfile {
  const roleMap: Record<BackendUser['role'], UserProfile['role']> = {
    STUDENT: 'Student',
    TEACHER: 'Mentor',
    ADMIN: 'Admin',
  };

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMap[user.role],
    credits: 0,
    streak: 0,
    avatarColor:
      user.role === 'TEACHER'
        ? '#9ED5DC'
        : user.role === 'ADMIN'
          ? '#D7C5F5'
          : '#B9E4E8',
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();

    return (
      data.detail ||
      data.message ||
      data.title ||
      'Something went wrong. Please try again.'
    );
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function authRequest(
  endpoint: '/auth/login' | '/auth/register',
  body: LoginCredentials | RegisterCredentials,
): Promise<{ user: UserProfile; token: string }> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json() as AuthResponse;

  if (!data.accessToken || !data.user) {
    throw new Error('Invalid authentication response from server.');
  }

  const user = mapBackendUser(data.user);

  StorageService.saveToken(data.accessToken);
  StorageService.saveUser(user);

  return {
    user,
    token: data.accessToken,
  };
}

export const ApiService = {
  async login(credentials: LoginCredentials) {
    return authRequest('/auth/login', credentials);
  },

  async register(credentials: RegisterCredentials) {
    return authRequest('/auth/register', credentials);
  },

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = StorageService.getToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  },

  async fetchNotes() {
    return this.request('/notes');
  },

  async askAI(req: AskAIRequest): Promise<AskAIResponse> {
    const response = await fetch(`${AI_SERVICE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return await response.json() as AskAIResponse;
  },
};
