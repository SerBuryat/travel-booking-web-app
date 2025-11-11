import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_health_attrs`
const healthAttrsSchema = z.object({
  provision_time: z.string().min(1, 'provision_time обязателен').transform((v) => new Date(v)),
  adults_qty: z.number().int().min(1, 'adults_qty минимум 1'),
});

export const healthRequestSchema = baseRequestSchema.extend({
  tbids_health_attrs: healthAttrsSchema,
});

export type HealthRequestData = z.infer<typeof healthRequestSchema>;

