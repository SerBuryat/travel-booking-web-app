import { z } from 'zod';

export const serviceRegistrationSchema = z.object({
  // Основная информация о сервисе
  name: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  
  description: z.string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(500, 'Описание не должно превышать 500 символов'),
  
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Цена должна быть числом с максимум 2 знаками после запятой')
    .refine(val => parseFloat(val) > 0, 'Цена должна быть больше 0'),
  
  tcategories_id: z.number()
    .min(1, 'Выберите категорию'),
  
  address: z.string()
    .min(5, 'Адрес должен содержать минимум 5 символов')
    .max(200, 'Адрес не должен превышать 200 символов'),
  
  tarea_id: z.number()
    .min(1, 'Выберите зону'),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Неверный формат телефона')
    .optional(),
  
  tg_username: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Неверный формат username Telegram')
    .optional(),
  
  serviceOptions: z.array(z.string())
    .optional(),
  
  // Данные провайдера (новые поля)
  providerCompanyName: z.string()
    .min(2, 'Название компании должно содержать минимум 2 символа')
    .max(255, 'Название компании не должно превышать 255 символов'),
  
  providerContactPerson: z.string()
    .min(2, 'Имя контактного лица должно содержать минимум 2 символа')
    .max(100, 'Имя контактного лица не должно превышать 100 символов'),
  
  providerPhone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Неверный формат телефона компании')
    .min(10, 'Телефон должен содержать минимум 10 символов')
    .max(20, 'Телефон не должен превышать 20 символов')
});

export type ServiceRegistrationFormData = z.infer<typeof serviceRegistrationSchema>;
