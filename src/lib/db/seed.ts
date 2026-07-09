import { db } from './dexie';
import { Category } from '@/types';
import { generateId } from '@/lib/utils';

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Family', slug: 'family', order: 1, color: '#ef4444' },
  { name: 'Friends', slug: 'friends', order: 2, color: '#f97316' },
  { name: 'Career', slug: 'career', order: 3, color: '#eab308' },
  { name: 'Education', slug: 'education', order: 4, color: '#22c55e' },
  { name: 'Health', slug: 'health', order: 5, color: '#14b8a6' },
  { name: 'Finance', slug: 'finance', order: 6, color: '#06b6d4' },
  { name: 'Travel', slug: 'travel', order: 7, color: '#3b82f6' },
  { name: 'Startup', slug: 'startup', order: 8, color: '#6366f1' },
  { name: 'Competitive Exams', slug: 'competitive-exams', order: 9, color: '#8b5cf6' },
  { name: 'Fitness', slug: 'fitness', order: 10, color: '#a855f7' },
  { name: 'Relationships', slug: 'relationships', order: 11, color: '#d946ef' },
  { name: 'Personal Growth', slug: 'personal-growth', order: 12, color: '#ec4899' },
  { name: 'Books', slug: 'books', order: 13, color: '#f43f5e' },
  { name: 'Movies', slug: 'movies', order: 14, color: '#64748b' },
  { name: 'Hobbies', slug: 'hobbies', order: 15, color: '#78716c' },
  { name: 'Technology', slug: 'technology', order: 16, color: '#0ea5e9' },
];

export async function seedDatabase() {
  const existingCategories = await db.categories.toArray();
  
  if (existingCategories.length === 0) {
    const categories: Category[] = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: generateId(),
      createdAt: new Date(),
    }));
    
    await db.categories.bulkAdd(categories);
    console.log('Database seeded with default categories');
  }
}
