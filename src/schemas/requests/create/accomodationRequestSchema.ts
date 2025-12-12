import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_accomodation_attrs`
const accomodationAttrsSchema = z.object({
  date_from: z.string().min(1, 'date_from обязателен').transform((v) => new Date(v)),
  date_to: z.string().min(1, 'date_to обязателен').transform((v) => new Date(v)),
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

// Полная форма для accomodation: `tbids` + nested attrs
export const accomodationRequestSchema = baseRequestSchema.extend({
  tbids_accomodation_attrs: accomodationAttrsSchema,
});

export type AccomodationRequestData = z.infer<typeof accomodationRequestSchema>;
