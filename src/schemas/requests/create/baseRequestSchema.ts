import { z } from 'zod';

// Базовая схема для всех заявок
export const baseRequestSchema = z.object({
  budget: z.string()
    .optional()
    .refine(val => !val || val === '' || /^\d+(\.\d{1,2})?$/.test(val), 'Бюджет должен быть числом с максимум 2 знаками после запятой')
    .refine(val => !val || val === '' || parseFloat(val) > 0, 'Бюджет должен быть больше 0'),
  
  additionalNotes: z.string()
    .optional()
    .refine(val => !val || val.length <= 500, 'Дополнительные пожелания не должны превышать 500 символов'),
});
