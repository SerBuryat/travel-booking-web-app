import { z } from 'zod';

export const createProposalSchema = z.object({
  requestId: z.number().int().positive('ID заявки должен быть положительным числом'),
  serviceIds: z.array(z.number().int().positive('ID сервиса должен быть положительным числом'))
    .min(1, 'Необходимо выбрать хотя бы один сервис'),
  price: z.number()
    .positive('Цена должна быть положительным числом')
    .max(99999999.99, 'Цена не должна превышать 99999999.99')
    .refine(
      (val) => {
        // Проверяем, что до запятой не более 8 цифр
        // DECIMAL(10, 2) означает максимум 10 цифр всего, 2 после запятой
        // Максимальное значение: 99999999.99 (8 цифр до запятой, 2 после)
        const str = val.toString();
        const parts = str.split('.');
        const integerPart = parts[0];
        return integerPart.length <= 8;
      },
      'Цена не должна содержать более 8 цифр до запятой'
    )
    .optional(),
  comment: z.string().optional(),
});

export type CreateProposalData = z.infer<typeof createProposalSchema>;
