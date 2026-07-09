import { useState, useMemo } from 'react';
import { Lock, Unlock, Calendar, Plus, Clock, Eye, EyeOff } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { formatDate } from '@/lib/utils';

export default function TimeCapsules() {
  const { memoriesQuery } = useMemories();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  const memories = memoriesQuery.data || [];

  // Filter time capsules
  const timeCapsules = useMemo(() => {
    return memories.filter(m => m.isTimeCapsule);
  }, [memories]);

  // Separate locked and unlocked capsules
  const lockedCapsules = useMemo(() => {
    const now = new Date();
    return timeCapsules.filter(m => {
      if (!m.timeCapsuleOpenDate) return true;
      return new Date(m.timeCapsuleOpenDate) > now;
    });
  }, [timeCapsules]);

  const unlockedCapsules = useMemo(() => {
    const now = new Date();
    return timeCapsules.filter(m => {
      if (!m.timeCapsuleOpenDate) return false;
      return new Date(m.timeCapsuleOpenDate) <= now;
    });
  }, [timeCapsules]);

  const getTimeUntilOpen = (openDate: Date) => {
    const now = new Date();
    const diff = new Date(openDate).getTime() - now.getTime();
    
    if (diff <= 0) return 'Available now';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    
    return 'Less than a day';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Time Capsules</h1>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
          Create Time Capsule
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Capsules</h3>
          </div>
          <p className="text-3xl font-bold">{timeCapsules.length}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Locked</h3>
          </div>
          <p className="text-3xl font-bold">{lockedCapsules.length}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Unlock className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Ready to Open</h3>
          </div>
          <p className="text-3xl font-bold">{unlockedCapsules.length}</p>
        </div>
      </div>

      {/* Locked Capsules */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-500" />
          Locked Capsules
        </h2>

        {lockedCapsules.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No locked time capsules</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold">{capsule.title}</h3>
                  </div>
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {capsule.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Opens: {capsule.timeCapsuleOpenDate ? formatDate(new Date(capsule.timeCapsuleOpenDate)) : 'N/A'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm font-medium text-orange-500">
                  {getTimeUntilOpen(capsule.timeCapsuleOpenDate || new Date())}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlocked Capsules */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Unlock className="w-5 h-5 text-green-500" />
          Ready to Open
        </h2>

        {unlockedCapsules.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <Unlock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No capsules ready to open</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedCapsules.map((capsule) => (
              <div
                key={capsule.id}
                onClick={() => setSelectedMemory(capsule.id)}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border-green-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">{capsule.title}</h3>
                  </div>
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {capsule.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Opened: {capsule.timeCapsuleOpenDate ? formatDate(new Date(capsule.timeCapsuleOpenDate)) : 'N/A'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm font-medium text-green-500">
                  Click to view
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            {(() => {
              const memory = memories.find(m => m.id === selectedMemory);
              if (!memory) return null;
              
              return (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold">{memory.title}</h2>
                    <button
                      onClick={() => setSelectedMemory(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <EyeOff className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-muted-foreground">{memory.description}</p>
                  </div>
                  
                  {memory.fullStory && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Full Story</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{memory.fullStory}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(new Date(memory.date))}</span>
                      </div>
                      {memory.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{memory.time}</span>
                        </div>
                      )}
                      {memory.location?.name && (
                        <div className="flex items-center gap-2">
                          <span className="text-primary">📍</span>
                          <span>{memory.location.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {memory.emotions.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Emotions</h3>
                      <div className="flex flex-wrap gap-2">
                        {memory.emotions.map((emotion) => (
                          <span
                            key={emotion.type}
                            className="px-3 py-1 bg-secondary rounded-full text-sm"
                          >
                            {emotion.type} ({emotion.intensity}/10)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {memory.tags.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-secondary/50 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-green-500 font-medium">
                      ✓ This time capsule is now open
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create Time Capsule</h2>
            <p className="text-muted-foreground mb-6">
              Time capsules are memories that are locked until a future date. 
              They're perfect for preserving moments to revisit later.
            </p>
            
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">How to create a time capsule:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to the Capture page</li>
                  <li>Create a new memory</li>
                  <li>Enable "Time Capsule" in Settings</li>
                  <li>Set the opening date</li>
                  <li>Save your memory</li>
                </ol>
              </div>
              
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  window.location.href = '/capture';
                }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Go to Capture Page
              </button>
              
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full py-3 border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
