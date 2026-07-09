import { useState, useMemo } from 'react';
import { Search as SearchIcon, Calendar, MapPin, Heart, Tag, Filter, X } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { useCategories } from '@/hooks/useCategories';
import { EmotionType } from '@/types';
import { formatDate } from '@/lib/utils';

type SearchType = 'keyword' | 'date' | 'emotion' | 'category' | 'location' | 'tag';

export default function Search() {
  const { memoriesQuery } = useMemories();
  const { categoriesQuery } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('keyword');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const memories = memoriesQuery.data || [];
  const categories = categoriesQuery.data || [];

  const EMOTIONS: { type: EmotionType; label: string }[] = [
    { type: 'happy', label: 'Happy' },
    { type: 'proud', label: 'Proud' },
    { type: 'grateful', label: 'Grateful' },
    { type: 'excited', label: 'Excited' },
    { type: 'sad', label: 'Sad' },
    { type: 'angry', label: 'Angry' },
    { type: 'fear', label: 'Fear' },
    { type: 'regret', label: 'Regret' },
    { type: 'hope', label: 'Hope' },
    { type: 'motivated', label: 'Motivated' },
    { type: 'lonely', label: 'Lonely' },
    { type: 'peaceful', label: 'Peaceful' },
    { type: 'love', label: 'Love' },
    { type: 'loss', label: 'Loss' },
  ];

  // Filter memories based on search criteria
  const filteredMemories = useMemo(() => {
    let results = [...memories];

    // Keyword search
    if (searchType === 'keyword' && searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(memory =>
        memory.title.toLowerCase().includes(query) ||
        memory.description.toLowerCase().includes(query) ||
        memory.fullStory.toLowerCase().includes(query)
      );
    }

    // Date range search
    if (searchType === 'date' && (dateFrom || dateTo)) {
      results = results.filter(memory => {
        const memoryDate = new Date(memory.date);
        if (dateFrom && memoryDate < new Date(dateFrom)) return false;
        if (dateTo && memoryDate > new Date(dateTo)) return false;
        return true;
      });
    }

    // Emotion search
    if (searchType === 'emotion' && selectedEmotion) {
      results = results.filter(memory =>
        memory.emotions.some(e => e.type === selectedEmotion)
      );
    }

    // Category search
    if (searchType === 'category' && selectedCategory) {
      results = results.filter(memory =>
        memory.categories.includes(selectedCategory)
      );
    }

    // Location search
    if (searchType === 'location' && searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(memory =>
        memory.location?.name?.toLowerCase().includes(query) ||
        memory.location?.city?.toLowerCase().includes(query) ||
        memory.location?.country?.toLowerCase().includes(query)
      );
    }

    // Tag search
    if (searchType === 'tag' && searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(memory =>
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [memories, searchType, searchQuery, selectedEmotion, selectedCategory, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEmotion(null);
    setSelectedCategory(null);
    setDateFrom('');
    setDateTo('');
    setSearchType('keyword');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search Memories</h1>

      {/* Search Bar */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'keyword' ? 'Search by keyword...' :
                searchType === 'date' ? 'Date range selected below...' :
                searchType === 'emotion' ? 'Select emotion below...' :
                searchType === 'category' ? 'Select category below...' :
                searchType === 'location' ? 'Search by location...' :
                'Search by tag...'
              }
              disabled={searchType === 'date' || searchType === 'emotion' || searchType === 'category'}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Search Type Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSearchType('keyword')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'keyword' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            Keyword
          </button>
          <button
            onClick={() => setSearchType('date')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'date' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Date
          </button>
          <button
            onClick={() => setSearchType('emotion')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'emotion' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-1" />
            Emotion
          </button>
          <button
            onClick={() => setSearchType('category')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'category' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </button>
          <button
            onClick={() => setSearchType('location')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'location' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </button>
          <button
            onClick={() => setSearchType('tag')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              searchType === 'tag' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-1" />
            Tag
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Date Range */}
            {searchType === 'date' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Emotion Selector */}
            {searchType === 'emotion' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion.type}
                    onClick={() => setSelectedEmotion(emotion.type)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedEmotion === emotion.type
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {emotion.label}
                  </button>
                ))}
              </div>
            )}

            {/* Category Selector */}
            {searchType === 'category' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={clearFilters}
              className="w-full py-2 border rounded-lg hover:bg-accent transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'} found
          </h2>
        </div>

        {filteredMemories.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <SearchIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No memories found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{memory.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(memory.date))}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{memory.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {memory.emotions.slice(0, 3).map((emotion) => (
                    <span
                      key={emotion.type}
                      className="px-2 py-1 bg-secondary rounded-full text-xs"
                    >
                      {emotion.type}
                    </span>
                  ))}
                  {memory.emotions.length > 3 && (
                    <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                      +{memory.emotions.length - 3}
                    </span>
                  )}
                </div>

                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {memory.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary/50 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {memory.tags.length > 5 && (
                      <span className="px-2 py-1 bg-secondary/50 rounded-full text-xs">
                        +{memory.tags.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
