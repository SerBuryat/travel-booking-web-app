import {CategoryEntity} from '@/entity/CategoryEntity';
import {ContactsType} from '@/model/ContactsType';

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
  rating?: string;
  view_count?: number;
  options: string[];
  address: string;
}

export interface ServiceTypeFull extends ServiceType {
  contacts: ContactsType[];
}