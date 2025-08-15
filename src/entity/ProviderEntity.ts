// Типы для провайдеров
export interface ProviderEntity {
  id: number;
  tclients_id: number;
  company_name: string;
  phone: string;
  contact_info?: any;
  status: string;
  created_at: Date;
}
