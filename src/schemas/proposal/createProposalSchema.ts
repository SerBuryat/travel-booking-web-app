import { z } from 'zod';

export const createProposalSchema = z.object({
  requestId: z.number().int().positive('ID заявки должен быть положительным числом'),
  serviceIds: z.array(z.number().int().positive('ID сервиса должен быть положительным числом'))
    .min(1, 'Необходимо выбрать хотя бы один сервис'),
  price: z.number().positive('Цена должна быть положительным числом'),
  comment: z.string().optional(),
});

export type CreateProposalData = z.infer<typeof createProposalSchema>;
