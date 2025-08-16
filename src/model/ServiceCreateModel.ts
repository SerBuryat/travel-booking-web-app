export interface ServiceCreateModel {
  // Основная информация о сервисе
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  address: string;
  tarea_id: number;
  phone?: string;
  tg_username?: string;
  serviceOptions?: string[]; // Названия опций сервиса (например: ["wi-fi", "бассейн"])
  
  // Данные провайдера (новые поля)
  providerCompanyName: string;
  providerContactPerson: string;
  providerPhone: string;
}
