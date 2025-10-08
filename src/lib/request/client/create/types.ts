import { z } from 'zod';
import { accomodationRequestSchema } from '@/schemas/requests/create/accomodationRequestSchema';
import { entertainmentRequestSchema } from '@/schemas/requests/create/entertainmentRequestSchema';
import { transportRequestSchema } from '@/schemas/requests/create/transportRequestSchema';

// Base DTO coming from form schemas (client -> API)
export type AccomodationFormDto = z.infer<typeof accomodationRequestSchema>;
export type EntertainmentFormDto = z.infer<typeof entertainmentRequestSchema>;
export type TransportFormDto = z.infer<typeof transportRequestSchema>;

// Minimal unified result of creating a request
export interface CreateRequestResult {
  id: number;
}


