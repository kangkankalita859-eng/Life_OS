export interface ContactInfo {
  email?: string;
  phone?: string;
  socialLinks?: string[];
}

export interface PersonMetadata {
  firstMetDate?: Date;
  howWeMet?: string;
  notes?: string;
}

export interface Person {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  relationship?: string;
  contactInfo?: ContactInfo;
  metadata?: PersonMetadata;
  createdAt: Date;
  updatedAt: Date;
}
