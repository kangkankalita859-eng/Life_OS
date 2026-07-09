import Dexie, { Table } from 'dexie';
import { Memory, Person, Category, Collection, Goal, Letter, Quote } from '@/types';

export class LifeOSDatabase extends Dexie {
  memories!: Table<Memory>;
  people!: Table<Person>;
  categories!: Table<Category>;
  collections!: Table<Collection>;
  goals!: Table<Goal>;
  letters!: Table<Letter>;
  quotes!: Table<Quote>;

  constructor() {
    super('LifeOSDatabase');
    
    // Define tables with indexes
    this.version(1).stores({
      memories: 'id, date, createdAt, importance, privacy, isFavorite, isTimeCapsule, timeCapsuleOpenDate, *categories, *emotions.type, *people.id, *tags, *location.city, *location.country',
      people: 'id, name, createdAt',
      categories: 'id, slug, parentId, order',
      collections: 'id, createdAt',
      goals: 'id, category, status, targetDate, completedDate',
      letters: 'id, deliveryDate, isDelivered',
      quotes: 'id, *tags, createdAt'
    });
  }
}

export const db = new LifeOSDatabase();
