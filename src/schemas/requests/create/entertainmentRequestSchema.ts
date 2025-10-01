import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_entertainment_attrs`
const entertainmentAttrsSchema = z.object({
  provision_time: z.string().min(1, 'provision_time обязателен').transform((v) => new Date(v)),
  adults_qty: z.number().int().min(1, 'adults_qty минимум 1'),
});

export const entertainmentRequestSchema = baseRequestSchema.extend({
  tbids_entertainment_attrs: entertainmentAttrsSchema,
});

export type EntertainmentRequestData = z.infer<typeof entertainmentRequestSchema>;
