import { z } from 'zod';

// Базовая схема 1-в-1 с колонками `tbids` (кроме server-managed: id, tclients_id, created_at)
export const baseRequestSchema = z.object({
  budget: z.number()
    .nonnegative('budget должен быть >= 0')
    .max(9999999999.99, 'Бюджет не должен превышать 9999999999.99')
    .refine(
      (val) => {
        // Проверяем, что до запятой не более 10 цифр
        // DECIMAL(12, 2) означает максимум 12 цифр всего, 2 после запятой
        // Максимальное значение: 9999999999.99 (10 цифр до запятой, 2 после)
        const str = val.toString();
        const parts = str.split('.');
        const integerPart = parts[0];
        return integerPart.length <= 10;
      },
      'Бюджет не должен содержать более 10 цифр до запятой'
    ),
  comment: z.string().nullable().optional(),
});
