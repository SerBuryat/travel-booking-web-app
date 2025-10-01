import { z } from 'zod';

// Базовая схема 1-в-1 с колонками `tbids` (кроме server-managed: id, tclients_id, created_at)
export const baseRequestSchema = z.object({
  budget: z.number().nonnegative('budget должен быть >= 0'),
  comment: z.string().nullable().optional(),
});
