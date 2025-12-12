import { z } from 'zod';
import { baseRequestSchema } from './baseRequestSchema';

// Атрибуты 1-в-1 к `tbids_package_attrs`
const packageAttrsSchema = z.object({
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
  start_date: z.string().min(1, 'start_date обязателен').transform((v) => new Date(v)),
  nights_from: z.number()
    .int('nights_from должен быть целым числом')
    .min(1, 'nights_from минимум 1')
    .max(32767, 'nights_from не должен превышать 32767'),
  nights_to: z.number()
    .int('nights_to должен быть целым числом')
    .min(1, 'nights_to минимум 1')
    .max(32767, 'nights_to не должен превышать 32767')
    .nullable()
    .optional(),
});

export const packageRequestSchema = baseRequestSchema.extend({
  tbids_package_attrs: packageAttrsSchema,
});

export type PackageRequestData = z.infer<typeof packageRequestSchema>;

