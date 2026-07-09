# Life OS Architecture

## System Overview

Life OS is a single-page application (SPA) built with React + TypeScript, designed for long-term personal data management with a focus on privacy, scalability, and AI integration.

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Styling**: TailwindCSS (utility-first CSS)
- **Components**: shadcn/ui (modern, accessible components)
- **Icons**: Lucide React (consistent icon set)
- **State Management**: React Context + Hooks (for simple state)
- **Routing**: React Router v6 (client-side routing)

### Data Layer
- **Primary Storage**: IndexedDB (via Dexie.js wrapper)
- **Caching**: React Query (TanStack Query) for data caching
- **Search**: FlexSearch (full-text search) + Vector similarity search
- **Export**: JSZip, jsPDF, PapaParse (for various export formats)

### AI Integration (Future)
- **Embeddings**: OpenAI Embeddings API or local models
- **Text Generation**: OpenAI GPT API or local LLM
- **Image Recognition**: TensorFlow.js (for photo tagging)

### Development
- **Package Manager**: npm or pnpm
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)

---

## Project Structure

```
life-os/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   │   ├── memory/          # Memory-specific components
│   │   ├── timeline/        # Timeline components
│   │   └── dashboard/       # Dashboard components
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Timeline.tsx
│   │   ├── MemoryCapture.tsx
│   │   ├── Journal.tsx
│   │   ├── Photos.tsx
│   │   ├── Videos.tsx
│   │   ├── VoiceMemories.tsx
│   │   ├── Documents.tsx
│   │   ├── EmotionExplorer.tsx
│   │   ├── LifeCategories.tsx
│   │   ├── Achievements.tsx
│   │   ├── Failures.tsx
│   │   ├── Lessons.tsx
│   │   ├── Dreams.tsx
│   │   ├── Goals.tsx
│   │   ├── Letters.tsx
│   │   ├── TimeCapsules.tsx
│   │   ├── Gratitude.tsx
│   │   ├── Quotes.tsx
│   │   ├── MemoryMap.tsx
│   │   ├── Search.tsx
│   │   ├── Statistics.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── Settings.tsx
│   │   └── Profile.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useMemories.ts
│   │   ├── useSearch.ts
│   │   ├── useTimeline.ts
│   │   └── useStatistics.ts
│   ├── lib/                 # Utility libraries
│   │   ├── db/              # Database layer
│   │   │   ├── schema.ts    # Database schema
│   │   │   ├── dexie.ts     # Dexie instance
│   │   │   └── migrations.ts
│   │   ├── search/          # Search functionality
│   │   │   ├── index.ts     # Search index management
│   │   │   └── vector.ts    # Vector similarity search
│   │   ├── ai/              # AI integration
│   │   │   ├── embeddings.ts
│   │   │   └── summary.ts
│   │   ├── export/          # Data export
│   │   │   ├── json.ts
│   │   │   ├── csv.ts
│   │   │   └── pdf.ts
│   │   └── utils.ts         # General utilities
│   ├── types/               # TypeScript type definitions
│   │   ├── memory.ts
│   │   ├── person.ts
│   │   ├── category.ts
│   │   └── index.ts
│   ├── stores/              # State management
│   │   ├── memoryStore.ts
│   │   ├── uiStore.ts
│   │   └── userStore.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── tests/                   # Test files
├── DATABASE_SCHEMA.md       # Database schema documentation
├── ARCHITECTURE.md          # This file
├── README.md                # Project documentation
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # TailwindCSS configuration
```

---

## Core Architecture Patterns

### 1. Data Layer Pattern

**Separation of Concerns:**
- UI components don't directly access IndexedDB
- All data access goes through a service layer
- Service layer handles caching, error handling, and data transformation

**Benefits:**
- Easy to swap storage implementation
- Consistent error handling
- Testable data access logic
- Centralized caching strategy

### 2. Memory Relationship Pattern

**Single Source of Truth:**
- Each memory stored once in `memories` table
- Views are derived from memory metadata (categories, emotions, people, tags)
- No duplication of memory data

**Implementation:**
- IndexedDB multi-entry indexes for array fields
- Query by metadata to populate views
- Real-time updates when memory metadata changes

### 3. Component Architecture

**Atomic Design:**
- Atoms: Basic UI elements (Button, Input, Card)
- Molecules: Component combinations (MemoryCard, TimelineItem)
- Organisms: Complex sections (Dashboard, Timeline)
- Templates: Page layouts
- Pages: Complete views

**Benefits:**
- Reusable components
- Consistent design system
- Easy to maintain and test

### 4. State Management Strategy

**Local State vs Global State:**
- Local state: Component-specific UI state (modals, form inputs)
- Global state: Application state (current user, theme, preferences)
- Server state: Data from IndexedDB (managed by React Query)

**Benefits:**
- Clear separation of concerns
- Automatic caching and invalidation
- Optimistic updates
- Background refetching

---

## Key Features Implementation

### Dashboard
- **Today's Memories**: Query memories where date = today
- **On This Day**: Query memories where month/day = today's month/day
- **Statistics**: Pre-calculated in `statistics` table, updated on memory changes
- **Mood Graph**: Aggregate emotions from last 30 days

### Timeline
- **Interactive Navigation**: Filter by year/month/day
- **Milestones**: Display from `user_profile.milestones`
- **Life Chapters**: Display from `user_profile.lifeChapters`
- **Calendar View**: Custom calendar component with memory markers

### Memory Capture
- **Form Validation**: React Hook Form + Zod schema
- **Media Upload**: File input with drag-and-drop
- **Emotion Selector**: Multi-select with intensity sliders
- **Auto-save**: Draft saved to IndexedDB

### Emotion Explorer
- **Emotion Filtering**: Query by `emotions.type`
- **Intensity Visualization**: Bar charts showing emotion distribution
- **Time-based Analysis**: Emotion trends over time

### Search
- **Keyword Search**: FlexSearch full-text search
- **Semantic Search**: Vector similarity using embeddings
- **Faceted Search**: Filter by date, emotion, category, person
- **Natural Language**: Parse intent and construct queries

### Time Capsules
- **Future Date Locking**: Check `timeCapsuleOpenDate` before displaying
- **Scheduled Reveal**: Background job to unlock capsules
- **Notification**: Alert when capsule becomes available

### Statistics
- **Automatic Calculation**: Triggered on memory CRUD operations
- **Incremental Updates**: Update only changed metrics
- **Background Processing**: Heavy calculations in Web Workers

---

## Performance Optimization

### 1. IndexedDB Optimization
- Use indexes for all query patterns
- Batch operations for bulk inserts
- Lazy load media (store URLs, load on demand)
- Pagination for large result sets

### 2. React Optimization
- Memoization with React.memo
- Code splitting with React.lazy
- Virtual scrolling for long lists
- Debounced search input

### 3. Asset Optimization
- Image compression before storage
- Thumbnail generation for photos
- Lazy loading for videos
- Progressive image loading

### 4. Search Optimization
- Incremental index updates
- Debounced search queries
- Cached search results
- Web Workers for heavy search operations

---

## Security & Privacy

### 1. Data Privacy
- All data stored locally by default
- Optional end-to-end encryption for cloud sync
- Granular privacy controls per memory
- No tracking or analytics

### 2. Data Security
- Input validation on all forms
- Sanitization of user-generated content
- Secure file upload handling
- XSS prevention

### 3. Backup & Recovery
- Automatic backup reminders
- Multiple export formats
- Data integrity checks
- Recovery tools for corrupted data

---

## AI Integration Architecture

### 1. Embedding Generation
- Triggered on memory creation/update
- Batch processing for bulk operations
- Cached embeddings to avoid regeneration
- Fallback to local models if API unavailable

### 2. AI-Generated Metadata
- Summary generation on memory creation
- Tag suggestion based on content
- Emotion detection from text
- User can override AI suggestions

### 3. Semantic Search
- Query embedding for user search
- Cosine similarity for ranking
- Hybrid search (keyword + semantic)
- Explainable results

---

## Testing Strategy

### 1. Unit Tests
- Test data layer functions
- Test utility functions
- Test custom hooks
- Test pure components

### 2. Integration Tests
- Test database operations
- Test search functionality
- Test export/import
- Test AI integration

### 3. E2E Tests
- Test critical user flows
- Test memory capture
- Test timeline navigation
- Test search and filtering

---

## Deployment Strategy

### 1. Development
- Local development with Vite dev server
- Hot module replacement
- TypeScript strict mode
- ESLint + Prettier

### 2. Build
- Optimized production build
- Code splitting
- Tree shaking
- Asset optimization

### 3. Distribution
- Single HTML file option (for offline use)
- PWA for mobile installation
- Desktop app via Electron (optional)
- Web app for browser access

---

## Future Enhancements

### 1. Cloud Sync
- Optional cloud backup
- Cross-device synchronization
- End-to-end encryption
- Conflict resolution

### 2. Collaboration
- Family sharing with permissions
- Collaborative memories
- Shared collections
- Memory gifting

### 3. Advanced AI
- Life coaching
- Pattern recognition
- Predictive insights
- Personalized recommendations

### 4. Integrations
- Calendar integration
- Photo library import
- Social media import
- Health data integration

---

## Migration & Longevity

### 1. Data Migration
- Schema versioning
- Automatic migration scripts
- Backward compatibility
- Data validation

### 2. Format Longevity
- Open data formats (JSON, CSV)
- Standard media formats
- Export to archival formats
- Documentation for future developers

### 3. Technology Updates
- Regular dependency updates
- Framework migration paths
- API stability guarantees
- Deprecation warnings
