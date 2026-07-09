import { useState, useMemo } from 'react';
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { formatDate, formatTime } from '@/lib/utils';
import { Memory } from '@/types';

type ViewMode = 'all' | 'year' | 'month' | 'day';

export default function Timeline() {
  const { memoriesQuery } = useMemories();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [filterImportance, setFilterImportance] = useState<string>('all');

  const memories = memoriesQuery.data || [];

  // Get unique years from memories
  const years = useMemo(() => {
    const yearSet = new Set(memories.map(m => new Date(m.date).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [memories]);

  // Get unique months for selected year
  const months = useMemo(() => {
    const monthSet = new Set(
      memories
        .filter(m => new Date(m.date).getFullYear() === selectedYear)
        .map(m => new Date(m.date).getMonth())
    );
    return Array.from(monthSet).sort((a, b) => b - a);
  }, [memories, selectedYear]);

  // Get unique days for selected year and month
  const days = useMemo(() => {
    const daySet = new Set(
      memories
        .filter(m => {
          const date = new Date(m.date);
          return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
        })
        .map(m => new Date(m.date).getDate())
    );
    return Array.from(daySet).sort((a, b) => b - a);
  }, [memories, selectedYear, selectedMonth]);

  // Filter memories based on current view
  const filteredMemories = useMemo(() => {
    let filtered = [...memories];

    // Apply importance filter
    if (filterImportance !== 'all') {
      filtered = filtered.filter(m => m.importance === filterImportance);
    }

    // Apply view mode filter
    if (viewMode === 'year') {
      filtered = filtered.filter(m => new Date(m.date).getFullYear() === selectedYear);
    } else if (viewMode === 'month') {
      filtered = filtered.filter(m => {
        const date = new Date(m.date);
        return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
      });
    } else if (viewMode === 'day') {
      filtered = filtered.filter(m => {
        const date = new Date(m.date);
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() === selectedMonth &&
          date.getDate() === selectedDay
        );
      });
    }

    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [memories, viewMode, selectedYear, selectedMonth, selectedDay, filterImportance]);

  // Group memories by date
  const groupedMemories = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    filteredMemories.forEach(memory => {
      const dateKey = new Date(memory.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(memory);
    });
    return groups;
  }, [filteredMemories]);

  const navigateYear = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const currentIndex = years.indexOf(selectedYear);
      if (currentIndex < years.length - 1) {
        setSelectedYear(years[currentIndex + 1]);
      }
    } else {
      const currentIndex = years.indexOf(selectedYear);
      if (currentIndex > 0) {
        setSelectedYear(years[currentIndex - 1]);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const currentIndex = months.indexOf(selectedMonth);
      if (currentIndex < months.length - 1) {
        setSelectedMonth(months[currentIndex + 1]);
      }
    } else {
      const currentIndex = months.indexOf(selectedMonth);
      if (currentIndex > 0) {
        setSelectedMonth(months[currentIndex - 1]);
      }
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const currentIndex = days.indexOf(selectedDay);
      if (currentIndex < days.length - 1) {
        setSelectedDay(days[currentIndex + 1]);
      }
    } else {
      const currentIndex = days.indexOf(selectedDay);
      if (currentIndex > 0) {
        setSelectedDay(days[currentIndex - 1]);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Timeline</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Importance</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'year' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'day' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {viewMode !== 'all' && (
        <div className="bg-card border rounded-lg p-4 mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (viewMode === 'year') navigateYear('prev');
              else if (viewMode === 'month') navigateMonth('prev');
              else if (viewMode === 'day') navigateDay('prev');
            }}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {viewMode === 'year' && (
              <span className="text-xl font-semibold">{selectedYear}</span>
            )}
            {viewMode === 'month' && (
              <span className="text-xl font-semibold">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
            )}
            {viewMode === 'day' && (
              <span className="text-xl font-semibold">
                {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (viewMode === 'year') navigateYear('next');
              else if (viewMode === 'month') navigateMonth('next');
              else if (viewMode === 'day') navigateDay('next');
            }}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Timeline Content */}
      {Object.keys(groupedMemories).length === 0 ? (
        <div className="bg-card border rounded-lg p-6 text-center">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No memories found</h2>
          <p className="text-muted-foreground">
            {viewMode === 'all' 
              ? 'Start capturing your life moments to see them here.'
              : 'No memories for this time period.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMemories).map(([dateKey, dayMemories]) => (
            <div key={dateKey} className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Date marker */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
                  <CalendarIcon className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">{formatDate(new Date(dateKey))}</h2>
                <span className="text-muted-foreground text-sm">
                  {dayMemories.length} {dayMemories.length === 1 ? 'memory' : 'memories'}
                </span>
              </div>

              {/* Memory cards */}
              <div className="ml-12 space-y-4">
                {dayMemories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{memory.title}</h3>
                      <div className="flex items-center gap-2">
                        {memory.isFavorite && (
                          <span className="text-red-500">★</span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          memory.importance === 'critical' ? 'bg-red-100 text-red-800' :
                          memory.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                          memory.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {memory.importance}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{memory.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {memory.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {memory.time}
                        </span>
                      )}
                      {memory.location && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {memory.location.name}
                        </span>
                      )}
                      {memory.emotions.length > 0 && (
                        <span className="flex items-center gap-1">
                          {memory.emotions.slice(0, 3).map(e => (
                            <span key={e.type} className="text-xs">
                              {e.type}
                            </span>
                          ))}
                          {memory.emotions.length > 3 && <span>+{memory.emotions.length - 3}</span>}
                        </span>
                      )}
                    </div>

                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {memory.tags.slice(0, 5).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-secondary rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {memory.tags.length > 5 && (
                          <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                            +{memory.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
