
import { NoteItem, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'edubridge_user',
  TOKEN: 'edubridge_access_token',
  NOTES: 'edubridge_notes',
  THEME: 'edubridge_theme',
  OFFLINE_CACHE: 'edubridge_offline_cache',
};

export const StorageService = {
  saveUser: (user: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.warn('LocalStorage save failed', error);
    }
  },

  getUser: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) as UserProfile : null;
    } catch {
      return null;
    }
  },

  saveToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  saveNotes: (notes: NoteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.warn('Failed to cache notes', error);
    }
  },

  getNotes: (): NoteItem[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) as NoteItem[] : null;
    } catch {
      return null;
    }
  },

  isOnline: (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },
};
