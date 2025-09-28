import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Схема для заявки на проживание
export const accomodationRequestSchema = baseRequestSchema.extend({
  destination: z.string()
    .min(2, 'Город назначения должен содержать минимум 2 символа')
    .max(100, 'Город назначения не должен превышать 100 символов'),
  
  checkIn: z.string()
    .min(1, 'Дата заезда обязательна'),
  
  checkOut: z.string()
    .min(1, 'Дата выезда обязательна'),
  
  guests: z.number()
    .min(1, 'Количество гостей должно быть минимум 1')
    .max(20, 'Количество гостей не должно превышать 20'),
  
  accommodationType: z.string()
    .min(2, 'Тип размещения должен содержать минимум 2 символа')
    .max(100, 'Тип размещения не должен превышать 100 символов')
    .optional(),
});

export type AccomodationRequestData = z.infer<typeof accomodationRequestSchema>;
