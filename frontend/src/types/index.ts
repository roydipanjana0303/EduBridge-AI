export type UserRole = 'Student' | 'Mentor';

export interface UserProfile {
  name: string;
  role: UserRole;
  credits: number;
  streak: number;
  avatarColor: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  isOffline: boolean;
  content?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'docx' | 'image' | 'text';
  fileName?: string;
  fileUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them' | 'system';
  text: string;
  time?: string;
  fileName?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  subject: string;
  avatarColor: string;
  status: string;
  messages: ChatMessage[];
}

export interface VoiceRoom {
  id: string;
  name: string;
  participants: string[];
  isLive: boolean;
  topic?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  isJoined: boolean;
  category: string;
}

export interface QAItem {
  id: string;
  question: string;
  askedBy: string;
  answer?: string;
  answeredBy?: string;
  upvotes: number;
  time: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface RewardItem {
  id: string;
  title: string;
  creditsCost: number;
  description: string;
  badge?: string;
}

export type ActiveView =
  | 'home'
  | 'notes'
  | 'chat'
  | 'community'
  | 'voice'
  | 'groups'
  | 'qa'
  | 'ai'
  | 'gap'
  | 'career'
  | 'quiz'
  | 'offline'
  | 'rewards';
