export interface CreateServiceEntity {
  id: number;
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  provider_id: number;
  status: string;
  created_at: string;
  serviceOptions?: string[] | null; // Названия опций сервиса
  tcontacts: CreateServiceContactEntity[];
  tlocations: CreateServiceLocationEntity[];
}

export interface CreateServiceContactEntity {
  id: number;
  tservices_id: number;
  email: string;
  phone?: string | null;
  tg_username?: string | null;
  website?: string | null;
  whatsap?: string | null;
}

export interface CreateServiceLocationEntity {
  id: number;
  tservices_id: number;
  name?: string | null;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  tarea_id: number;
  description?: string | null;
}
