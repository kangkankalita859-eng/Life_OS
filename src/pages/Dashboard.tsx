import { Calendar, Heart, TrendingUp, Clock, Plus, Flame, BookOpen, MapPin, Target, BarChart3, ArrowRight } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { useCategories } from '@/hooks/useCategories';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { useMemo } from 'react';

export default function Dashboard() {
  const { memoriesQuery, useMemoriesByDate, useFavoriteMemories } = useMemories();
  const { categoriesQuery } = useCategories();
  const todayMemories = useMemoriesByDate(new Date());
  const favoriteMemories = useFavoriteMemories();

  const memories = memoriesQuery.data || [];
  const categories = categoriesQuery.data || [];

  // Calculate journal streak
  const journalStreak = useMemo(() => {
    if (memories.length === 0) return 0;
    
    const dates = [...new Set(memories.map(m => 
      new Date(m.date).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dates[0] !== today && dates[0] !== yesterday) return 0;
    
    let streak = 0;
    for (let i = 0; i < dates.length; i++) {
      const current = new Date(dates[i]);
      const next = i < dates.length - 1 ? new Date(dates[i + 1]) : null;
      
      if (i === 0) {
        streak = 1;
      } else if (next) {
        const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  }, [memories]);

  // Calculate "On This Day" memories
  const onThisDayMemories = useMemo(() => {
    const today = new Date();
    return memories.filter(m => {
      const memoryDate = new Date(m.date);
      return memoryDate.getDate() === today.getDate() &&
             memoryDate.getMonth() === today.getMonth() &&
             memoryDate.getFullYear() !== today.getFullYear();
    });
  }, [memories]);

  // Calculate this month's memories
  const thisMonthMemories = useMemo(() => {
    const today = new Date();
    return memories.filter(m => {
      const memoryDate = new Date(m.date);
      return memoryDate.getMonth() === today.getMonth() &&
             memoryDate.getFullYear() === today.getFullYear();
    }).length;
  }, [memories]);

  // Calculate unique locations
  const uniqueLocations = useMemo(() => {
    const locations = new Set(memories.map(m => m.location?.name).filter(Boolean));
    return locations.size;
  }, [memories]);

  // Calculate books read
  const booksRead = useMemo(() => {
    const booksCategory = categories.find(c => c.name.toLowerCase() === 'books');
    if (!booksCategory) return 0;
    return memories.filter(m => m.categories.includes(booksCategory.id)).length;
  }, [memories, categories]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Life OS</h1>
          <p className="text-muted-foreground">Your personal life operating system</p>
        </div>
        <Link
          to="/capture"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Capture Memory</span>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Memories */}
        <Link to="/timeline" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Total</span>
          </div>
          <p className="text-4xl font-bold mb-1">{memories.length}</p>
          <p className="text-sm opacity-80">Memories</p>
        </Link>

        {/* Journal Streak */}
        <Link to="/statistics" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Streak</span>
          </div>
          <p className="text-4xl font-bold mb-1">{journalStreak}</p>
          <p className="text-sm opacity-80">Days</p>
        </Link>

        {/* This Month */}
        <Link to="/timeline" className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">This Month</span>
          </div>
          <p className="text-4xl font-bold mb-1">{thisMonthMemories}</p>
          <p className="text-sm opacity-80">Memories</p>
        </Link>

        {/* Favorites */}
        <Link to="/timeline" className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Favorites</span>
          </div>
          <p className="text-4xl font-bold mb-1">{favoriteMemories.data?.length || 0}</p>
          <p className="text-sm opacity-80">Memories</p>
        </Link>
      </div>

      {/* Content Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Memories */}
        <Link to={todayMemories.data && todayMemories.data.length > 0 ? "/timeline" : "/capture"} className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold">Today's Memories</h2>
            </div>
            <span className="text-2xl font-bold text-primary">{todayMemories.data?.length || 0}</span>
          </div>
          {todayMemories.data && todayMemories.data.length > 0 ? (
            <div className="space-y-3">
              {todayMemories.data.slice(0, 3).map((memory) => (
                <div key={memory.id} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="font-medium text-sm">{memory.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {memory.time || 'No time'}
                  </div>
                </div>
              ))}
              {todayMemories.data.length > 3 && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  View all <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No memories today</p>
              <span className="text-sm text-primary mt-2 inline-block">
                Capture your first memory
              </span>
            </div>
          )}
        </Link>

        {/* On This Day */}
        <Link to={onThisDayMemories.length > 0 ? "/timeline" : "/capture"} className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold">On This Day</h2>
            </div>
            <span className="text-2xl font-bold text-primary">{onThisDayMemories.length}</span>
          </div>
          {onThisDayMemories.length > 0 ? (
            <div className="space-y-3">
              {onThisDayMemories.slice(0, 3).map((memory) => (
                <div key={memory.id} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="font-medium text-sm">{memory.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(memory.date).getFullYear()}
                  </div>
                </div>
              ))}
              {onThisDayMemories.length > 3 && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  View all <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No memories on this day</p>
            </div>
          )}
        </Link>

        {/* Recent Memories */}
        <Link to={memories.length > 0 ? "/timeline" : "/capture"} className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Recent Memories</h2>
            </div>
          </div>
          {memories.length > 0 ? (
            <div className="space-y-3">
              {memories.slice(-3).reverse().map((memory) => (
                <div key={memory.id} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="font-medium text-sm">{memory.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date(memory.date))}
                  </div>
                </div>
              ))}
              {memories.length > 3 && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  View all <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No memories yet</p>
              <span className="text-sm text-primary mt-2 inline-block">
                Capture your first memory
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Locations */}
        <Link to="/search" className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold">Locations</h2>
          </div>
          <p className="text-4xl font-bold text-primary mb-1">{uniqueLocations}</p>
          <p className="text-sm text-muted-foreground">Unique places visited</p>
        </Link>

        {/* Books */}
        <Link to="/categories" className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold">Books Read</h2>
          </div>
          <p className="text-4xl font-bold text-primary mb-1">{booksRead}</p>
          <p className="text-sm text-muted-foreground">Books recorded</p>
        </Link>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Link to="/capture" className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center text-sm font-medium">
              Capture Memory
            </Link>
            <Link to="/timeline" className="block w-full py-2 px-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center text-sm font-medium">
              View Timeline
            </Link>
            <Link to="/statistics" className="block w-full py-2 px-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-center text-sm font-medium">
              View Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
