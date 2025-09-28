import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Схема для заявки на транспорт
export const transportRequestSchema = baseRequestSchema.extend({
  from: z.string()
    .min(2, 'Город отправления должен содержать минимум 2 символа')
    .max(100, 'Город отправления не должен превышать 100 символов'),
  
  to: z.string()
    .min(2, 'Город назначения должен содержать минимум 2 символа')
    .max(100, 'Город назначения не должен превышать 100 символов'),
  
  departureDate: z.string()
    .min(1, 'Дата отправления обязательна'),
  
  departureTime: z.string()
    .optional(),
  
  transportType: z.string()
    .min(2, 'Тип транспорта должен содержать минимум 2 символа')
    .max(100, 'Тип транспорта не должен превышать 100 символов')
    .optional(),
  
  passengers: z.number()
    .min(1, 'Количество пассажиров должно быть минимум 1')
    .max(50, 'Количество пассажиров не должно превышать 50'),
});

export type TransportRequestData = z.infer<typeof transportRequestSchema>;
