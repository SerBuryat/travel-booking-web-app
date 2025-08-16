export interface ServiceEntity {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  provider_id?: number;
  status?: string;
  created_at?: string;
  priority?: string;
  rating?: number;
  view_count?: number;
} 