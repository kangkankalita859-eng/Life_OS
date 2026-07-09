export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  memoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  targetDate?: Date;
  completedDate?: Date;
  relatedMemoryIds: string[];
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  recipient?: string;
  deliveryDate?: Date;
  isDelivered: boolean;
  relatedMemoryIds?: string[];
  createdAt: Date;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  relatedMemoryIds?: string[];
  tags: string[];
  createdAt: Date;
}
