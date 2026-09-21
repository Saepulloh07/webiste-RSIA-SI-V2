// Global Types Definitions

export type BaseEntity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Doctor = BaseEntity & {
  name: string;
  degree: string;
  specialty: string;
  image?: string;
  schedule: any; // Will type properly later
  status: 'active' | 'inactive';
  slug: string;
};

export type Service = BaseEntity & {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  image?: string;
  status: 'published' | 'draft';
  sortOrder: number;
};
