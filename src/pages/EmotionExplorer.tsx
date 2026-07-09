import { useState, useMemo } from 'react';
import { Heart, TrendingUp, BarChart3 } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { EmotionType, Memory } from '@/types';
import { formatDate } from '@/lib/utils';

const EMOTIONS: { type: EmotionType; label: string; color: string; icon: string }[] = [
  { type: 'happy', label: 'Happy', color: 'bg-yellow-500', icon: '😊' },
  { type: 'proud', label: 'Proud', color: 'bg-orange-500', icon: '🏆' },
  { type: 'grateful', label: 'Grateful', color: 'bg-green-500', icon: '🙏' },
  { type: 'excited', label: 'Excited', color: 'bg-blue-500', icon: '🎉' },
  { type: 'sad', label: 'Sad', color: 'bg-blue-700', icon: '😢' },
  { type: 'angry', label: 'Angry', color: 'bg-red-600', icon: '😠' },
  { type: 'fear', label: 'Fear', color: 'bg-purple-600', icon: '😨' },
  { type: 'regret', label: 'Regret', color: 'bg-gray-600', icon: '😔' },
  { type: 'hope', label: 'Hope', color: 'bg-teal-500', icon: '🌟' },
  { type: 'motivated', label: 'Motivated', color: 'bg-indigo-500', icon: '💪' },
  { type: 'lonely', label: 'Lonely', color: 'bg-slate-500', icon: '😶' },
  { type: 'peaceful', label: 'Peaceful', color: 'bg-cyan-500', icon: '😌' },
  { type: 'love', label: 'Love', color: 'bg-pink-500', icon: '❤️' },
  { type: 'loss', label: 'Loss', color: 'bg-stone-600', icon: '💔' },
  { type: 'disappointment', label: 'Disappointment', color: 'bg-amber-700', icon: '😞' },
  { type: 'anxiety', label: 'Anxiety', color: 'bg-violet-600', icon: '😰' },
  { type: 'confident', label: 'Confident', color: 'bg-emerald-500', icon: '😎' },
  { type: 'surprised', label: 'Surprised', color: 'bg-rose-500', icon: '😲' },
  { type: 'confused', label: 'Confused', color: 'bg-zinc-500', icon: '😕' },
  { type: 'relieved', label: 'Relieved', color: 'bg-sky-500', icon: '😮‍💨' },
];

export default function EmotionExplorer() {
  const { memoriesQuery } = useMemories();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const memories = memoriesQuery.data || [];

  // Calculate emotion statistics
  const emotionStats = useMemo(() => {
    const stats: Record<EmotionType, { count: number; totalIntensity: number; memories: Memory[] }> = 
      {} as Record<EmotionType, { count: number; totalIntensity: number; memories: Memory[] }>;

    EMOTIONS.forEach(emotion => {
      stats[emotion.type] = { count: 0, totalIntensity: 0, memories: [] };
    });

    memories.forEach(memory => {
      memory.emotions.forEach(emotion => {
        if (stats[emotion.type]) {
          stats[emotion.type].count += 1;
          stats[emotion.type].totalIntensity += emotion.intensity;
          stats[emotion.type].memories.push(memory);
        }
      });
    });

    return stats;
  }, [memories]);

  // Get sorted emotions by count
  const sortedEmotions = useMemo(() => {
    return EMOTIONS.map(emotion => ({
      ...emotion,
      count: emotionStats[emotion.type].count,
      avgIntensity: emotionStats[emotion.type].count > 0 
        ? emotionStats[emotion.type].totalIntensity / emotionStats[emotion.type].count 
        : 0,
      memories: emotionStats[emotion.type].memories,
    })).sort((a, b) => b.count - a.count);
  }, [emotionStats]);

  // Get memories for selected emotion
  const selectedEmotionMemories = useMemo(() => {
    if (!selectedEmotion) return [];
    return emotionStats[selectedEmotion].memories.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedEmotion, emotionStats]);

  // Get most common emotion
  const mostCommonEmotion = sortedEmotions[0];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Emotion Explorer</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Emotional Memories</h3>
          </div>
          <p className="text-3xl font-bold">
            {memories.filter(m => m.emotions.length > 0).length}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Most Common Emotion</h3>
          </div>
          {mostCommonEmotion && mostCommonEmotion.count > 0 ? (
            <div>
              <p className="text-3xl font-bold">{mostCommonEmotion.icon} {mostCommonEmotion.label}</p>
              <p className="text-muted-foreground">{mostCommonEmotion.count} memories</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No emotions recorded yet</p>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Unique Emotions</h3>
          </div>
          <p className="text-3xl font-bold">
            {sortedEmotions.filter(e => e.count > 0).length}
          </p>
        </div>
      </div>

      {/* Emotion Grid */}
      {selectedEmotion ? (
        // Selected Emotion View
        <div>
          <button
            onClick={() => setSelectedEmotion(null)}
            className="mb-4 text-primary hover:underline flex items-center gap-2"
          >
            ← Back to all emotions
          </button>

          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{EMOTIONS.find(e => e.type === selectedEmotion)?.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{EMOTIONS.find(e => e.type === selectedEmotion)?.label}</h2>
                <p className="text-muted-foreground">
                  {selectedEmotionMemories.length} memories • 
                  Avg intensity: {emotionStats[selectedEmotion].count > 0 
                    ? (emotionStats[selectedEmotion].totalIntensity / emotionStats[selectedEmotion].count).toFixed(1)
                    : 0}/10
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedEmotionMemories.map((memory) => (
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
                <div className="flex items-center gap-2 text-sm">
                  {memory.emotions
                    .filter(e => e.type === selectedEmotion)
                    .map(e => (
                      <span key={e.type} className="px-2 py-1 bg-secondary rounded-full">
                        Intensity: {e.intensity}/10
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {selectedEmotionMemories.length === 0 && (
            <div className="bg-card border rounded-lg p-6 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No memories found</h2>
              <p className="text-muted-foreground">
                No memories with this emotion yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        // All Emotions Grid
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedEmotions.map((emotion) => (
                <div
                  key={emotion.type}
                  onClick={() => emotion.count > 0 && setSelectedEmotion(emotion.type)}
                  className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    emotion.count === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="text-4xl mb-2">{emotion.icon}</div>
                  <h3 className="font-semibold mb-1">{emotion.label}</h3>
                  <p className="text-2xl font-bold">{emotion.count}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: {emotion.avgIntensity.toFixed(1)}/10
                  </p>
                  
                  {emotion.count > 0 && (
                    <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${emotion.color}`}
                        style={{ width: `${(emotion.avgIntensity / 10) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Emotion Distribution</h3>
              <div className="space-y-3">
                {sortedEmotions
                  .filter(e => e.count > 0)
                  .map((emotion) => {
                    const maxCount = sortedEmotions[0].count;
                    const percentage = (emotion.count / maxCount) * 100;
                    
                    return (
                      <div key={emotion.type} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span>{emotion.icon}</span>
                            <span className="font-medium">{emotion.label}</span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {emotion.count} memories ({emotion.avgIntensity.toFixed(1)}/10)
                          </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${emotion.color} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {sortedEmotions.filter(e => e.count > 0).length === 0 && (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No emotions recorded yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
