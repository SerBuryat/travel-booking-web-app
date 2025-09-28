import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Схема для заявки на туры/активности
export const entertainmentRequestSchema = baseRequestSchema.extend({
  location: z.string()
    .min(2, 'Город/регион должен содержать минимум 2 символа')
    .max(100, 'Город/регион не должен превышать 100 символов'),
  
  activityDate: z.string()
    .min(1, 'Дата проведения обязательна'),
  
  activityType: z.string()
    .min(2, 'Тип активности должен содержать минимум 2 символа')
    .max(100, 'Тип активности не должен превышать 100 символов')
    .optional(),
  
  participants: z.number()
    .min(1, 'Количество участников должно быть минимум 1')
    .max(100, 'Количество участников не должно превышать 100'),
  
  difficultyLevel: z.string()
    .min(2, 'Уровень сложности должен содержать минимум 2 символа')
    .max(50, 'Уровень сложности не должен превышать 50 символов')
    .optional(),
  
  duration: z.string()
    .min(1, 'Продолжительность должна содержать минимум 1 символ')
    .max(100, 'Продолжительность не должна превышать 100 символов')
    .optional(),
});

export type EntertainmentRequestData = z.infer<typeof entertainmentRequestSchema>;
