import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db/dexie';
import { Memory } from '@/types';
import { generateId } from '@/lib/utils';

export function useMemories() {
  const queryClient = useQueryClient();

  // Get all memories
  const memoriesQuery = useQuery({
    queryKey: ['memories'],
    queryFn: () => db.memories.toArray(),
  });

  // Get memory by ID
  const useMemory = (id: string) => {
    return useQuery({
      queryKey: ['memories', id],
      queryFn: () => db.memories.get(id),
    });
  };

  // Create memory
  const createMemory = useMutation({
    mutationFn: async (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
      const newMemory: Memory = {
        ...memoryData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };
      await db.memories.add(newMemory);
      return newMemory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  // Update memory
  const updateMemory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Memory> }) => {
      const existing = await db.memories.get(id);
      if (!existing) throw new Error('Memory not found');
      
      const updated: Memory = {
        ...existing,
        ...data,
        updatedAt: new Date(),
        version: existing.version + 1,
      };
      await db.memories.put(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  // Delete memory
  const deleteMemory = useMutation({
    mutationFn: async (id: string) => {
      await db.memories.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  // Get memories by date
  const useMemoriesByDate = (date: Date) => {
    return useQuery({
      queryKey: ['memories', 'byDate', date.toDateString()],
      queryFn: () => db.memories.where('date').equals(date).toArray(),
    });
  };

  // Get memories by category
  const useMemoriesByCategory = (category: string) => {
    return useQuery({
      queryKey: ['memories', 'byCategory', category],
      queryFn: () => db.memories.where('categories').equals(category).toArray(),
    });
  };

  // Get memories by emotion
  const useMemoriesByEmotion = (emotion: string) => {
    return useQuery({
      queryKey: ['memories', 'byEmotion', emotion],
      queryFn: async () => {
        const allMemories = await db.memories.toArray();
        return allMemories.filter(memory => 
          memory.emotions.some(e => e.type === emotion)
        );
      },
    });
  };

  // Get favorite memories
  const useFavoriteMemories = () => {
    return useQuery({
      queryKey: ['memories', 'favorites'],
      queryFn: async () => {
        const allMemories = await db.memories.toArray();
        return allMemories.filter(memory => memory.isFavorite);
      },
    });
  };

  // Get time capsules
  const useTimeCapsules = () => {
    return useQuery({
      queryKey: ['memories', 'timeCapsules'],
      queryFn: async () => {
        const allMemories = await db.memories.toArray();
        return allMemories.filter(memory => memory.isTimeCapsule);
      },
    });
  };

  return {
    memoriesQuery,
    useMemory,
    createMemory,
    updateMemory,
    deleteMemory,
    useMemoriesByDate,
    useMemoriesByCategory,
    useMemoriesByEmotion,
    useFavoriteMemories,
    useTimeCapsules,
  };
}
