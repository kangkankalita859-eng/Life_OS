import { db } from '@/lib/db/dexie';
import { Memory, Emotion, PersonReference, MediaItem } from '@/types';
import { generateId } from '@/lib/utils';

export class MemoryService {
  // Create a new memory
  static async createMemory(data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Memory> {
    const memory: Memory = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    await db.memories.add(memory);
    return memory;
  }

  // Get memory by ID
  static async getMemory(id: string): Promise<Memory | undefined> {
    return await db.memories.get(id);
  }

  // Get all memories
  static async getAllMemories(): Promise<Memory[]> {
    return await db.memories.toArray();
  }

  // Update memory
  static async updateMemory(id: string, data: Partial<Memory>): Promise<Memory> {
    const existing = await db.memories.get(id);
    if (!existing) {
      throw new Error('Memory not found');
    }

    const updated: Memory = {
      ...existing,
      ...data,
      updatedAt: new Date(),
      version: existing.version + 1,
    };

    await db.memories.put(updated);
    return updated;
  }

  // Delete memory
  static async deleteMemory(id: string): Promise<void> {
    await db.memories.delete(id);
  }

  // Get memories by date range
  static async getMemoriesByDateRange(startDate: Date, endDate: Date): Promise<Memory[]> {
    return await db.memories
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  // Get memories for a specific date (today)
  static async getTodayMemories(): Promise<Memory[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db.memories
      .where('date')
      .between(today, tomorrow, true, false)
      .toArray();
  }

  // Get memories from this day in previous years (On This Day)
  static async getOnThisDayMemories(): Promise<Memory[]> {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory => {
      const memoryDate = new Date(memory.date);
      return (
        memoryDate.getMonth() === currentMonth &&
        memoryDate.getDate() === currentDay &&
        memoryDate.getFullYear() !== today.getFullYear()
      );
    });
  }

  // Get memories by category
  static async getMemoriesByCategory(category: string): Promise<Memory[]> {
    return await db.memories.where('categories').equals(category).toArray();
  }

  // Get memories by emotion
  static async getMemoriesByEmotion(emotionType: string): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory =>
      memory.emotions.some(emotion => emotion.type === emotionType)
    );
  }

  // Get memories by person
  static async getMemoriesByPerson(personId: string): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory =>
      memory.people.some(person => person.id === personId)
    );
  }

  // Get memories by location
  static async getMemoriesByLocation(city: string): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory =>
      memory.location?.city?.toLowerCase() === city.toLowerCase()
    );
  }

  // Get favorite memories
  static async getFavoriteMemories(): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory => memory.isFavorite);
  }

  // Get time capsules
  static async getTimeCapsules(): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory => memory.isTimeCapsule);
  }

  // Get available time capsules (past open date)
  static async getAvailableTimeCapsules(): Promise<Memory[]> {
    const now = new Date();
    const allMemories = await db.memories.toArray();
    return allMemories.filter(memory =>
      memory.isTimeCapsule &&
      memory.timeCapsuleOpenDate &&
      new Date(memory.timeCapsuleOpenDate) <= now &&
      !memory.isTimeCapsuleOpen
    );
  }

  // Unlock time capsule
  static async unlockTimeCapsule(id: string): Promise<Memory> {
    return await this.updateMemory(id, { isTimeCapsuleOpen: true });
  }

  // Search memories by keyword
  static async searchMemories(keyword: string): Promise<Memory[]> {
    const allMemories = await db.memories.toArray();
    const lowerKeyword = keyword.toLowerCase();

    return allMemories.filter(memory =>
      memory.title.toLowerCase().includes(lowerKeyword) ||
      memory.description.toLowerCase().includes(lowerKeyword) ||
      memory.fullStory.toLowerCase().includes(lowerKeyword) ||
      memory.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  // Add emotion to memory
  static async addEmotion(memoryId: string, emotion: Emotion): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedEmotions = [...memory.emotions, emotion];
    return await this.updateMemory(memoryId, { emotions: updatedEmotions });
  }

  // Remove emotion from memory
  static async removeEmotion(memoryId: string, emotionType: string): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedEmotions = memory.emotions.filter(e => e.type !== emotionType);
    return await this.updateMemory(memoryId, { emotions: updatedEmotions });
  }

  // Add person to memory
  static async addPerson(memoryId: string, person: PersonReference): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedPeople = [...memory.people, person];
    return await this.updateMemory(memoryId, { people: updatedPeople });
  }

  // Remove person from memory
  static async removePerson(memoryId: string, personId: string): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedPeople = memory.people.filter(p => p.id !== personId);
    return await this.updateMemory(memoryId, { people: updatedPeople });
  }

  // Add media to memory
  static async addMedia(memoryId: string, media: MediaItem): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedMedia = [...memory.media, media];
    return await this.updateMemory(memoryId, { media: updatedMedia });
  }

  // Remove media from memory
  static async removeMedia(memoryId: string, mediaId: string): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    const updatedMedia = memory.media.filter(m => m.id !== mediaId);
    return await this.updateMemory(memoryId, { media: updatedMedia });
  }

  // Toggle favorite status
  static async toggleFavorite(memoryId: string): Promise<Memory> {
    const memory = await this.getMemory(memoryId);
    if (!memory) throw new Error('Memory not found');

    return await this.updateMemory(memoryId, { isFavorite: !memory.isFavorite });
  }

  // Get recent memories
  static async getRecentMemories(limit: number = 10): Promise<Memory[]> {
    return await db.memories
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray();
  }
}
