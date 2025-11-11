import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_food_attrs`
const foodAttrsSchema = z.object({
  provision_time: z.string().min(1, 'provision_time обязателен').transform((v) => new Date(v)),
  adults_qty: z.number().int().min(1, 'adults_qty минимум 1'),
  kids_qty: z.number().int().min(0).nullable().optional(),
});

export const foodRequestSchema = baseRequestSchema.extend({
  tbids_food_attrs: foodAttrsSchema,
});

export type FoodRequestData = z.infer<typeof foodRequestSchema>;

