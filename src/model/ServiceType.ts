import { CategoryEntity } from '@/entity/CategoryEntity';

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  provider_id?: number;
  status?: string;
  created_at?: string;
  priority?: string;
  category?: CategoryEntity;
} 