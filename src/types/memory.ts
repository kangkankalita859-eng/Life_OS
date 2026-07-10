export type EmotionType = 
  | 'happy' | 'proud' | 'grateful' | 'excited' | 'sad' 
  | 'angry' | 'fear' | 'regret' | 'hope' | 'motivated' 
  | 'lonely' | 'peaceful' | 'love' | 'loss' | 'disappointment'
  | 'anxiety' | 'confident' | 'surprised' | 'confused' | 'relieved';

export interface Emotion {
  type: EmotionType;
  intensity: number; // 1-10 scale
  primary: boolean; // true if this is the dominant emotion
}

export interface Location {
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface PersonReference {
  id: string;
  name: string;
  relationship?: string;
  role?: string;
  isMentioned: boolean;
}

export type MediaType = 'photo' | 'video' | 'voice' | 'document' | 'link';

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number; // for video/audio in seconds
  caption?: string;
  altText?: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  size?: number;
  metadata?: MediaMetadata;
  createdAt: Date;
}

export type Importance = 'low' | 'medium' | 'high' | 'critical';
export type Privacy = 'private' | 'family' | 'friends' | 'public';

export interface Memory {
  // Primary Key
  id: string;
  
  // Basic Information
  title: string;
  description: string;
  fullStory: string;
  shortSummary: string;
  date: string; // ISO date string from HTML date input
  time?: string;
  location?: Location;
  
  // People
  people: PersonReference[];
  
  // Emotions
  emotions: Emotion[];
  
  // Media
  media: MediaItem[];
  
  // Organization
  tags: string[];
  categories: string[];
  collections: string[];
  isFavorite: boolean;
  importance: Importance;
  privacy: Privacy;
  
  // Reflection
  lessonsLearned?: string;
  mistakes?: string;
  adviceToFutureSelf?: string;
  whatWouldIDoDifferently?: string;
  
  // AI Metadata
  aiGeneratedSummary?: string;
  aiGeneratedTags?: string[];
  aiDetectedEmotions?: Emotion[];
  embeddingVector?: number[];
  
  // Time Capsule
  isTimeCapsule: boolean;
  timeCapsuleOpenDate?: Date;
  isTimeCapsuleOpen: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
