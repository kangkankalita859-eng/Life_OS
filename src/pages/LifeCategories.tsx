import { useState, useMemo } from 'react';
import { Folder, FolderOpen, Grid, List } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useMemories } from '@/hooks/useMemories';
import { Memory } from '@/types';
import { formatDate } from '@/lib/utils';

export default function LifeCategories() {
  const { categoriesQuery } = useCategories();
  const { memoriesQuery } = useMemories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = categoriesQuery.data || [];
  const memories = memoriesQuery.data || [];

  // Calculate memory count per category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; memories: Memory[] }> = {};
    
    categories.forEach(category => {
      stats[category.id] = { count: 0, memories: [] };
    });

    memories.forEach(memory => {
      memory.categories.forEach(categoryId => {
        if (stats[categoryId]) {
          stats[categoryId].count += 1;
          stats[categoryId].memories.push(memory);
        }
      });
    });

    return stats;
  }, [categories, memories]);

  // Get selected category memories
  const selectedCategoryMemories = useMemo(() => {
    if (!selectedCategory) return [];
    return categoryStats[selectedCategory]?.memories.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ) || [];
  }, [selectedCategory, categoryStats]);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Life Categories</h1>
        
        {!selectedCategory && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {selectedCategory ? (
        // Selected Category View
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-primary hover:underline flex items-center gap-2"
          >
            ← Back to all categories
          </button>

          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {selectedCategoryData?.color && (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: selectedCategoryData.color }}
                >
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedCategoryData?.name}</h2>
                <p className="text-muted-foreground">
                  {selectedCategoryMemories.length} memories
                </p>
              </div>
            </div>
            {selectedCategoryData?.description && (
              <p className="text-muted-foreground">{selectedCategoryData.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {selectedCategoryMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{memory.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(memory.date))}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">{memory.description}</p>
                <div className="flex flex-wrap gap-2">
                  {memory.categories.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return cat ? (
                      <span
                        key={catId}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: cat.color + '20',
                          color: cat.color,
                          border: `1px solid ${cat.color}`
                        }}
                      >
                        {cat.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedCategoryMemories.length === 0 && (
            <div className="bg-card border rounded-lg p-6 text-center">
              <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No memories in this category</h2>
              <p className="text-muted-foreground">
                Start capturing memories and assign them to this category.
              </p>
            </div>
          )}
        </div>
      ) : (
        // All Categories View
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const stats = categoryStats[category.id] || { count: 0 };
                
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: category.color }}
                    >
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-2xl font-bold">{stats.count}</p>
                    <p className="text-xs text-muted-foreground">memories</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const stats = categoryStats[category.id] || { count: 0 };
                  const maxCount = Math.max(...Object.values(categoryStats).map(s => s.count));
                  const percentage = maxCount > 0 ? (stats.count / maxCount) * 100 : 0;
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {stats.count} memories
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

              {categories.length === 0 && (
                <div className="text-center py-8">
                  <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No categories available</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
