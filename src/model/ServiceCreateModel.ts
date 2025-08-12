export interface ServiceCreateModel {
  name: string;
  description: string;
  price: string;
  tcategories_id: number;
  address: string;
  tarea_id: number;
  phone?: string;
  tg_username?: string;
  serviceOptions?: string[]; // Названия опций сервиса (например: ["wi-fi", "бассейн"])
}
