import { useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, MapPin, Heart, BookOpen, Award, Target, Flame } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { useCategories } from '@/hooks/useCategories';
import { EmotionType } from '@/types';

export default function Statistics() {
  const { memoriesQuery } = useMemories();
  const { categoriesQuery } = useCategories();

  const memories = memoriesQuery.data || [];
  const categories = categoriesQuery.data || [];

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    // Total memories
    const totalMemories = memories.length;

    // Journal streak (consecutive days with memories)
    let journalStreak = 0;
    if (memories.length > 0) {
      const dates = [...new Set(memories.map(m => 
        new Date(m.date).toDateString()
      ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (dates[0] === today || dates[0] === yesterday) {
        for (let i = 0; i < dates.length; i++) {
          const current = new Date(dates[i]);
          const next = i < dates.length - 1 ? new Date(dates[i + 1]) : null;
          
          if (i === 0) {
            journalStreak = 1;
          } else if (next) {
            const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);
            if (diffDays === 1) {
              journalStreak++;
            } else {
              break;
            }
          }
        }
      }
    }

    // Most common emotion
    const emotionCounts: Record<EmotionType, number> = {} as Record<EmotionType, number>;
    memories.forEach(memory => {
      memory.emotions.forEach(emotion => {
        emotionCounts[emotion.type] = (emotionCounts[emotion.type] || 0) + 1;
      });
    });
    
    const mostCommonEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Most visited location
    const locationCounts: Record<string, number> = {};
    memories.forEach(memory => {
      if (memory.location?.name) {
        locationCounts[memory.location.name] = (locationCounts[memory.location.name] || 0) + 1;
      }
    });
    
    const mostVisitedLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Total unique locations
    const uniqueLocations = Object.keys(locationCounts).length;
    
    // Books read (from category)
    const booksCategory = categories.find(c => c.name.toLowerCase() === 'books');
    const booksRead = booksCategory 
      ? memories.filter(m => m.categories.includes(booksCategory.id)).length
      : 0;
    
    // Movies watched (from category)
    const moviesCategory = categories.find(c => c.name.toLowerCase() === 'movies');
    const moviesWatched = moviesCategory
      ? memories.filter(m => m.categories.includes(moviesCategory.id)).length
      : 0;
    
    // Achievements (high/critical importance)
    const achievements = memories.filter(m => 
      m.importance === 'high' || m.importance === 'critical'
    ).length;
    
    // Favorite memories
    const favoriteMemories = memories.filter(m => m.isFavorite).length;
    
    // Memories this year
    const currentYear = new Date().getFullYear();
    const memoriesThisYear = memories.filter(m => 
      new Date(m.date).getFullYear() === currentYear
    ).length;
    
    // Memories this month
    const currentMonth = new Date().getMonth();
    const memoriesThisMonth = memories.filter(m => 
      new Date(m.date).getMonth() === currentMonth &&
      new Date(m.date).getFullYear() === currentYear
    ).length;
    
    // Average emotions per memory
    const avgEmotionsPerMemory = memories.length > 0
      ? memories.reduce((sum, m) => sum + m.emotions.length, 0) / memories.length
      : 0;
    
    // Total tags
    const allTags = memories.flatMap(m => m.tags);
    const uniqueTags = [...new Set(allTags)].length;
    
    // Category distribution
    const categoryDistribution = categories.map(category => ({
      ...category,
      count: memories.filter(m => m.categories.includes(category.id)).length,
    })).sort((a, b) => b.count - a.count);
    
    // Monthly activity (last 12 months)
    const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const count = memories.filter(m => 
        new Date(m.date).getMonth() === month &&
        new Date(m.date).getFullYear() === year
      ).length;
      
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year,
        count,
      };
    }).reverse();
    
    // Emotion trend (last 6 months)
    const emotionTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthMemories = memories.filter(m => 
        new Date(m.date).getMonth() === month &&
        new Date(m.date).getFullYear() === year
      );
      
      const emotionCounts: Record<EmotionType, number> = {} as Record<EmotionType, number>;
      monthMemories.forEach(memory => {
        memory.emotions.forEach(emotion => {
          emotionCounts[emotion.type] = (emotionCounts[emotion.type] || 0) + 1;
        });
      });
      
      const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
      
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year,
        topEmotion: topEmotion ? topEmotion[0] : null,
        emotionCount: topEmotion ? topEmotion[1] : 0,
      };
    }).reverse();

    return {
      totalMemories,
      journalStreak,
      mostCommonEmotion,
      mostVisitedLocation,
      uniqueLocations,
      booksRead,
      moviesWatched,
      achievements,
      favoriteMemories,
      memoriesThisYear,
      memoriesThisMonth,
      avgEmotionsPerMemory,
      uniqueTags,
      categoryDistribution,
      monthlyActivity,
      emotionTrend,
    };
  }, [memories, categories]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Life Statistics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Memories</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalMemories}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Journal Streak</h3>
          </div>
          <p className="text-3xl font-bold">{stats.journalStreak} days</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Favorites</h3>
          </div>
          <p className="text-3xl font-bold">{stats.favoriteMemories}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <p className="text-3xl font-bold">{stats.achievements}</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">This Year</h3>
          </div>
          <p className="text-3xl font-bold">{stats.memoriesThisYear}</p>
          <p className="text-sm text-muted-foreground">memories</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">This Month</h3>
          </div>
          <p className="text-3xl font-bold">{stats.memoriesThisMonth}</p>
          <p className="text-sm text-muted-foreground">memories</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Avg Emotions</h3>
          </div>
          <p className="text-3xl font-bold">{stats.avgEmotionsPerMemory.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">per memory</p>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Books Read</h3>
          </div>
          <p className="text-3xl font-bold">{stats.booksRead}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Movies Watched</h3>
          </div>
          <p className="text-3xl font-bold">{stats.moviesWatched}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Locations</h3>
          </div>
          <p className="text-3xl font-bold">{stats.uniqueLocations}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold">Unique Tags</h3>
          </div>
          <p className="text-3xl font-bold">{stats.uniqueTags}</p>
        </div>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Most Common Emotion
          </h3>
          {stats.mostCommonEmotion ? (
            <div>
              <p className="text-2xl font-bold capitalize">{stats.mostCommonEmotion[0]}</p>
              <p className="text-muted-foreground">{stats.mostCommonEmotion[1]} memories</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No emotions recorded yet</p>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Most Visited Location
          </h3>
          {stats.mostVisitedLocation ? (
            <div>
              <p className="text-2xl font-bold">{stats.mostVisitedLocation[0]}</p>
              <p className="text-muted-foreground">{stats.mostVisitedLocation[1]} memories</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No locations recorded yet</p>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Category Distribution
        </h3>
        <div className="space-y-3">
          {stats.categoryDistribution.map((category) => {
            const maxCount = stats.categoryDistribution[0]?.count || 1;
            const percentage = (category.count / maxCount) * 100;
            
            return (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {category.count} memories
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Monthly Activity (Last 12 Months)
        </h3>
        <div className="flex items-end gap-2 h-40">
          {stats.monthlyActivity.map((data) => {
            const maxCount = Math.max(...stats.monthlyActivity.map(d => d.count)) || 1;
            const height = (data.count / maxCount) * 100;
            
            return (
              <div key={`${data.month}-${data.year}`} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-secondary rounded-t relative">
                  <div
                    className="absolute bottom-0 w-full bg-primary transition-all rounded-t"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-xs text-center">
                  <div className="font-medium">{data.month}</div>
                  <div className="text-muted-foreground">{data.count}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emotion Trend */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Emotion Trend (Last 6 Months)
        </h3>
        <div className="space-y-3">
          {stats.emotionTrend.map((data) => (
            <div key={`${data.month}-${data.year}`} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-4">
                <span className="font-medium w-20">{data.month}</span>
                {data.topEmotion ? (
                  <span className="px-3 py-1 bg-secondary rounded-full text-sm capitalize">
                    {data.topEmotion} ({data.emotionCount})
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">No data</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
