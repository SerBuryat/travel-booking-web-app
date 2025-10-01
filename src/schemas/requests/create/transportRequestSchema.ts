import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_transport_attrs`
const transportAttrsSchema = z.object({
  provision_time: z.string().min(1, 'provision_time обязателен').transform((v) => new Date(v)),
  adults_qty: z.number().int().min(1, 'adults_qty минимум 1'),
  kids_qty: z.number().int().min(0).nullable().optional(),
});

export const transportRequestSchema = baseRequestSchema.extend({
  tbids_transport_attrs: transportAttrsSchema,
});

export type TransportRequestData = z.infer<typeof transportRequestSchema>;
