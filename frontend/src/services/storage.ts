import { NoteItem, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'edubridge_user',
  NOTES: 'edubridge_notes',
  THEME: 'edubridge_theme',
  OFFLINE_CACHE: 'edubridge_offline_cache',
};

export const StorageService = {
  saveUser: (user: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  },

  getUser: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveNotes: (notes: NoteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to cache notes', e);
    }
  },

  getNotes: (): NoteItem[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  isOnline: (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },
};
