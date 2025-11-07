import { z } from 'zod';
import { accomodationRequestSchema } from '@/schemas/requests/create/accomodationRequestSchema';
import { entertainmentRequestSchema } from '@/schemas/requests/create/entertainmentRequestSchema';
import { transportRequestSchema } from '@/schemas/requests/create/transportRequestSchema';
import { foodRequestSchema } from '@/schemas/requests/create/foodRequestSchema';
import { healthRequestSchema } from '@/schemas/requests/create/healthRequestSchema';
import { packageRequestSchema } from '@/schemas/requests/create/packageRequestSchema';

// Base DTO coming from form schemas (client -> API)
export type AccomodationFormDto = z.infer<typeof accomodationRequestSchema>;
export type EntertainmentFormDto = z.infer<typeof entertainmentRequestSchema>;
export type TransportFormDto = z.infer<typeof transportRequestSchema>;
export type FoodFormDto = z.infer<typeof foodRequestSchema>;
export type HealthFormDto = z.infer<typeof healthRequestSchema>;
export type PackageFormDto = z.infer<typeof packageRequestSchema>;

// Minimal unified result of creating a request
export interface CreateRequestResult {
  id: number;
}


