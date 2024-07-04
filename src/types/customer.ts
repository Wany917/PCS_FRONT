export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    avatar?: string;
    email: string;
    status: 'pending' | 'active' | 'blocked';
    createdAt: Date;
    updatedAt: Date;
  }