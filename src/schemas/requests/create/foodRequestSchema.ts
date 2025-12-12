import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_food_attrs`
const foodAttrsSchema = z.object({
  provision_time: z.string().min(1, 'provision_time обязателен').transform((v) => new Date(v)),
  adults_qty: z.number()
    .int('adults_qty должен быть целым числом')
    .min(1, 'adults_qty минимум 1')
    .max(32767, 'adults_qty не должен превышать 32767'),
  kids_qty: z.number()
    .int('kids_qty должен быть целым числом')
    .min(0, 'kids_qty минимум 0')
    .max(32767, 'kids_qty не должен превышать 32767')
    .nullable()
    .optional(),
});

export const foodRequestSchema = baseRequestSchema.extend({
  tbids_food_attrs: foodAttrsSchema,
});

export type FoodRequestData = z.infer<typeof foodRequestSchema>;

