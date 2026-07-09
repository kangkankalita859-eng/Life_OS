# Life OS - Personal Life Operating System

Life OS is a **Personal Life Operating System** that allows you to preserve, organize, understand, and relive your entire life in a structured and intelligent way. This is **NOT** a diary, note-taking, or journaling application - it's a comprehensive system designed for decades of personal data management.

## 🎯 Vision

When someone opens Life OS after 30 years, they should be able to experience their entire journey—from childhood to old age—in a meaningful and organized way. The system helps users remember memories, analyze personal growth, recognize patterns, preserve emotions, and eventually become an AI companion that understands their life.

## ✨ Core Features Implemented

### High Priority (Completed)
- **Database Schema**: Comprehensive Memory object with all required fields (emotions, media, people, locations, reflections, AI metadata)
- **Project Setup**: React + TypeScript + Vite with TailwindCSS
- **Data Layer**: IndexedDB via Dexie for local storage with full CRUD operations
- **Memory Service**: Complete CRUD operations with relationship management

### Medium Priority (Completed)
- **Dashboard**: Today's Memories, On This Day, Favorites, Recent Memories, Total Memories count
- **Timeline**: Interactive timeline with year/month/day navigation, importance filtering, grouped memory display
- **Memory Capture**: Full-featured form with emotions (14 types with intensity sliders), tags, categories, privacy settings, importance levels
- **Emotion Explorer**: Visual emotion grid/list views, emotion statistics, memory filtering by emotion
- **Life Categories**: 16 pre-seeded categories, category-based memory filtering, grid/list views
- **Search**: Multi-type search (keyword, date, emotion, category, location, tag) with advanced filters

### Low Priority (Pending)
- Time Capsules with future date locking
- Statistics module with automatic life statistics generation
- AI Assistant integration points (embeddings, summaries)
- Settings and Profile management

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Database**: IndexedDB (via Dexie.js)
- **Form Handling**: React Hook Form + Zod validation

### Key Design Principles
1. **Single Source of Truth**: Each memory stored once, appears in multiple views through metadata
2. **Privacy-First**: All data stored locally by default
3. **Long-Term Scalability**: Schema designed for decades of data growth
4. **AI-Ready**: Built-in support for embeddings and AI-generated metadata
5. **Clean Architecture**: Separation of concerns with service layer

## 📁 Project Structure

```
life-os/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Navigation.tsx
│   ├── hooks/
│   │   ├── useMemories.ts
│   │   ├── useCategories.ts
│   │   └── usePeople.ts
│   ├── lib/
│   │   ├── db/
│   │   │   ├── dexie.ts
│   │   │   └── seed.ts
│   │   ├── services/
│   │   │   └── memoryService.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Timeline.tsx
│   │   ├── MemoryCapture.tsx
│   │   ├── EmotionExplorer.tsx
│   │   ├── LifeCategories.tsx
│   │   └── Search.tsx
│   ├── types/
│   │   ├── memory.ts
│   │   ├── person.ts
│   │   ├── category.ts
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── DATABASE_SCHEMA.md
├── ARCHITECTURE.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎨 Features Overview

### Dashboard
- **Today's Memories**: View memories created today
- **On This Day**: See memories from this day in previous years
- **Journal Streak**: Track your memory capture consistency
- **Favorites**: Quick access to favorite memories
- **Recent Memories**: Latest memories captured
- **Statistics**: Total memory count

### Timeline
- **Multiple Views**: All, Year, Month, Day views
- **Navigation**: Navigate through time with intuitive controls
- **Filtering**: Filter by importance level
- **Grouped Display**: Memories grouped by date
- **Rich Cards**: Show emotions, tags, location, time

### Memory Capture
- **Basic Info**: Title, description, full story, date, time, location
- **Emotions**: 14 emotion types with intensity sliders (1-10)
- **Tags**: Custom tags for organization
- **Categories**: 16 pre-defined life categories
- **Settings**: Importance levels, privacy controls
- **Validation**: Form validation with React Hook Form + Zod

### Emotion Explorer
- **Visual Grid**: Color-coded emotion cards with counts
- **Statistics**: Most common emotion, total emotional memories
- **Intensity Tracking**: Average intensity per emotion
- **Drill Down**: View all memories for specific emotions
- **Multiple Views**: Grid and list views

### Life Categories
- **16 Categories**: Family, Friends, Career, Education, Health, Finance, Travel, Startup, Competitive Exams, Fitness, Relationships, Personal Growth, Books, Movies, Hobbies, Technology
- **Memory Count**: See how many memories per category
- **Color-Coded**: Each category has a unique color
- **Filtering**: View memories by category

### Search
- **Multiple Search Types**: Keyword, Date, Emotion, Category, Location, Tag
- **Advanced Filters**: Date range, emotion selector, category selector
- **Real-time Results**: Instant filtering as you type
- **Rich Display**: Shows emotions, tags, and metadata

## 💾 Data Storage

### IndexedDB
- All data stored locally in browser's IndexedDB
- No size limitations (unlike localStorage)
- Offline functionality
- Fast queries with indexes

### Data Export (Future)
- JSON export for backup
- CSV export for spreadsheets
- PDF export for physical archiving

## 🔒 Privacy & Security

- **Local Storage**: All data stored locally by default
- **Privacy Controls**: Granular privacy settings per memory (Private, Family, Friends, Public)
- **No Tracking**: No analytics or tracking
- **Data Ownership**: Complete control over your data

## 🧠 AI Integration (Future)

The schema is designed for AI integration:
- **Embedding Vectors**: For semantic search
- **AI-Generated Summaries**: Auto-generated concise summaries
- **AI-Generated Tags**: Suggested tags based on content
- **Emotion Detection**: AI-detected emotions from text
- **Natural Language Search**: Query with natural language

## 📊 Statistics (Future)

Automatic generation of life statistics:
- Number of memories
- Books read
- Countries/cities visited
- Journal streak
- Most common emotion
- Most visited location
- Most mentioned person
- Achievement count
- Goal completion rate
- Mood trend

## 🎯 Roadmap

### Phase 1 (Completed)
- ✅ Core database schema
- ✅ Basic CRUD operations
- ✅ Dashboard
- ✅ Timeline
- ✅ Memory Capture
- ✅ Emotion Explorer
- ✅ Life Categories
- ✅ Search

### Phase 2 (In Progress)
- ⏳ Time Capsules
- ⏳ Statistics Module
- ⏳ Settings & Profile

### Phase 3 (Future)
- ⏳ AI Integration
- ⏳ Cloud Sync (optional)
- ⏳ Mobile App
- ⏳ Collaboration Features

## 🤝 Contributing

This is a personal project designed for long-term use. Contributions that align with the vision of a Personal Life Operating System are welcome.

## 📄 License

Private project for personal use.

## 🙏 Acknowledgments

Built with modern web technologies and designed for longevity and privacy.
