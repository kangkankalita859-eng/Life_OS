# Life OS Database Schema

## Core Design Principles

1. **Single Source of Truth**: Each memory is stored exactly once
2. **Relationship-Based Organization**: Memories appear in multiple views through metadata relationships
3. **Long-Term Scalability**: Schema designed for decades of data growth
4. **AI-Ready**: Built-in support for embeddings and AI-generated metadata
5. **Privacy-First**: Granular privacy controls at memory level

---

## Core Memory Object

### Table: `memories`

```typescript
interface Memory {
  // Primary Key
  id: string; // UUID v4
  
  // Basic Information
  title: string;
  description: string; // Short description (1-2 sentences)
  fullStory: string; // Detailed narrative
  shortSummary: string; // AI-generated or user-provided summary
  date: Date; // ISO 8601 format
  time?: string; // HH:MM format (optional)
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    country?: string;
  };
  
  // People
  people: PersonReference[];
  
  // Emotions (Multiple emotions per memory)
  emotions: Emotion[];
  
  // Media
  media: MediaItem[];
  
  // Organization
  tags: string[];
  categories: string[]; // References to Life Categories
  collections: string[]; // Custom collections
  isFavorite: boolean;
  importance: 'low' | 'medium' | 'high' | 'critical';
  privacy: 'private' | 'family' | 'friends' | 'public';
  
  // Reflection
  lessonsLearned?: string;
  mistakes?: string;
  adviceToFutureSelf?: string;
  whatWouldIDoDifferently?: string;
  
  // AI Metadata
  aiGeneratedSummary?: string;
  aiGeneratedTags?: string[];
  aiDetectedEmotions?: Emotion[];
  embeddingVector?: number[]; // For semantic search
  
  // Time Capsule
  isTimeCapsule: boolean;
  timeCapsuleOpenDate?: Date;
  isTimeCapsuleOpen: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version: number; // For optimistic locking
}
```

---

## Supporting Schemas

### Person Reference

```typescript
interface PersonReference<{
  id: string; // Reference to people table
  name: string;
  relationship?: string; // "mother", "friend", "colleague", etc.
  role?: string; // "mentor", "witness", "participant", etc.
  isMentioned: boolean; // true if just mentioned, false if actively involved
}>
```

### Emotion

```typescript
interface Emotion {
  type: EmotionType;
  intensity: number; // 1-10 scale
  primary: boolean; // true if this is the dominant emotion
}

type EmotionType = 
  | 'happy' | 'proud' | 'grateful' | 'excited' | 'sad' 
  | 'angry' | 'fear' | 'regret' | 'hope' | 'motivated' 
  | 'lonely' | 'peaceful' | 'love' | 'loss' | 'disappointment'
  | 'anxiety' | 'confident' | 'surprised' | 'confused' | 'relieved';
```

### Media Item

```typescript
interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'voice' | 'document' | 'link';
  url: string; // Storage path or external URL
  thumbnailUrl?: string;
  mimeType?: string;
  size?: number; // in bytes
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for video/audio in seconds
    caption?: string;
    altText?: string;
  };
  createdAt: Date;
}
```

---

## Supporting Tables

### Table: `people`

```typescript
interface Person {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  relationship?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    socialLinks?: string[];
  };
  metadata?: {
    firstMetDate?: Date;
    howWeMet?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Table: `categories`

```typescript
interface Category {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  icon?: string;
  color?: string;
  description?: string;
  parentId?: string; // For nested categories
  order: number; // For custom ordering
  createdAt: Date;
}
```

### Table: `collections`

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  memoryIds: string[]; // Array of memory IDs
  createdAt: Date;
  updatedAt: Date;
}
```

### Table: `goals`

```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string; // Reference to category
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  targetDate?: Date;
  completedDate?: Date;
  relatedMemoryIds: string[]; // Memories related to this goal
  progress?: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}
```

### Table: `letters`

```typescript
interface Letter {
  id: string;
  title: string;
  content: string;
  recipient?: string; // "future self", "children", etc.
  deliveryDate?: Date; // For time capsules
  isDelivered: boolean;
  relatedMemoryIds?: string[];
  createdAt: Date;
}
```

### Table: `quotes`

```typescript
interface Quote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  relatedMemoryIds?: string[];
  tags: string[];
  createdAt: Date;
}
```

### Table: `statistics`

```typescript
interface Statistics {
  id: string;
  userId: string;
  totalMemories: number;
  totalPhotos: number;
  totalVideos: number;
  totalVoiceNotes: number;
  totalDocuments: number;
  journalStreak: number;
  longestJournalStreak: number;
  mostCommonEmotion: EmotionType;
  mostVisitedLocation: string;
  mostPhotographedPlace: string;
  mostMentionedPerson: string;
  achievementCount: number;
  goalCompletionRate: number;
  moodTrend: number[]; // Last 30 days mood scores
  booksRead: number;
  countriesVisited: number;
  citiesVisited: number;
  lastCalculated: Date;
}
```

### Table: `user_profile`

```typescript
interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  birthDate?: Date;
  timezone: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    defaultPrivacy: 'private' | 'family' | 'friends' | 'public';
  };
  lifeChapters: LifeChapter[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

interface LifeChapter {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  color?: string;
}

interface Milestone {
  id: string;
  title: string;
  date: Date;
  icon?: string;
  description?: string;
}
```

---

## Index Design

### Primary Indexes

- `memories.id` (Primary Key)
- `people.id` (Primary Key)
- `categories.id` (Primary Key)
- `collections.id` (Primary Key)
- `goals.id` (Primary Key)

### Secondary Indexes (for efficient querying)

#### Memory Indexes
- `memories.date` (for timeline and date-based queries)
- `memories.createdAt` (for recent memories)
- `memories.importance` (for filtering by importance)
- `memories.privacy` (for privacy filtering)
- `memories.isFavorite` (for favorites)
- `memories.isTimeCapsule` (for time capsules)
- `memories.timeCapsuleOpenDate` (for time capsule scheduling)
- `memories.categories` (multi-value index for category filtering)
- `memories.emotions.type` (multi-value index for emotion filtering)
- `memories.people.id` (multi-value index for person filtering)
- `memories.tags` (multi-value index for tag search)
- `memories.location.city` (for location-based queries)
- `memories.location.country` (for location-based queries)

#### Composite Indexes
- `memories.date + memories.importance` (for timeline with importance)
- `memories.date + memories.privacy` (for timeline with privacy)
- `memories.isTimeCapsule + memories.timeCapsuleOpenDate` (for time capsule queries)

---

## Storage Strategy

### Local Storage (IndexedDB)
- Primary storage for all user data
- Enables offline functionality
- No size limitations (unlike localStorage)
- Full-text search capabilities

### Data Export/Import
- JSON export for backup
- CSV export for spreadsheets
- PDF export for physical archiving

### Cloud Sync (Future)
- Optional cloud backup
- End-to-end encryption
- Cross-device synchronization

---

## AI Integration Points

### Vector Embeddings
- Stored in `memories.embeddingVector`
- Enables semantic search
- Used for "similar memories" recommendations
- Generated on memory creation/update

### AI-Generated Metadata
- `aiGeneratedSummary`: Auto-generated concise summary
- `aiGeneratedTags`: Suggested tags based on content
- `aiDetectedEmotions`: Emotion detection from text

### Natural Language Search
- Query embedding for semantic search
- Intent recognition for complex queries
- Context-aware results

---

## Scalability Considerations

### Data Partitioning
- Partition by year for timeline queries
- Partition by category for category-based views
- Archive old data (10+ years) to separate storage

### Performance Optimization
- Lazy loading for media
- Pagination for large result sets
- Caching for frequently accessed data
- Background indexing for new memories

### Long-Term Preservation
- Version control for memory updates
- Data migration scripts for schema changes
- Regular backup reminders
- Multiple export formats

---

## Security & Privacy

### Data Encryption
- Encrypt sensitive fields at rest
- Optional client-side encryption for cloud sync

### Access Control
- Granular privacy settings per memory
- Family sharing with permissions
- Emergency access designations

### Data Retention
- Soft delete for memories (recoverable)
- Permanent delete option
- Data export before account deletion

---

## Migration Strategy

### Version Control
- Schema version in `user_profile`
- Automatic migration on app update
- Backward compatibility for at least 2 major versions

### Data Validation
- Schema validation on import
- Data integrity checks
- Repair tools for corrupted data
