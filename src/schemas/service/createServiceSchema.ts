import {z} from 'zod';

export type CreateServiceData = z.infer<typeof createServiceSchema>;

// схема формы создания сервиса
export const createServiceSchema = z.object({
  // Основная информация о сервисе
  name: z.string()
  .min(3, 'Название должно содержать минимум 3 символа')
  .max(100, 'Название не должно превышать 100 символов'),

  description: z.string()
  .max(1000, 'Описание не должно превышать 1000 символов')
  .optional(),

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
  .min(1, 'Телефон обязателен для заполнения')
  .regex(/^\+?[\d\s\-()]+$/, 'Неверный формат телефона'),

  tg_username: z.string()
  .refine(
    (val) => !val || val.trim() === '' || 
      // Username: может начинаться с @, содержит буквы, цифры, подчеркивания (5-32 символа)
      /^@?[a-zA-Z0-9_]{5,32}$/.test(val) ||
      // Или телефон: начинается с +, содержит цифры, пробелы, дефисы, скобки
      /^\+?[\d\s\-()]+$/.test(val),
    'Неверный формат. Введите юзернейм (5-32 символа) или номер телефона'
  )
  .optional(),

  website: z.string()
  .refine(
    (val) => !val || val.trim() === '' || /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^([а-яА-ЯёЁ0-9]([а-яА-ЯёЁ0-9\-]{0,61}[а-яА-ЯёЁ0-9])?\.)+[а-яА-ЯёЁ]{2,}$/.test(val),
    'Неверный формат домена'
  )
  .optional(),

  whatsap: z.string()
  .refine(
    (val) => !val || val.trim() === '' || /^\+?[\d\s\-()]+$/.test(val),
    'Неверный формат телефона'
  )
  .optional(),

  serviceOptions: z.array(z.string())
  .optional(),

  event_date: z.preprocess(
    (val) => {
      if (!val || val === '' || (typeof val === 'string' && val.trim() === '')) {
        return undefined;
      }
      // datetime-local возвращает строку в формате "YYYY-MM-DDTHH:mm"
      // Преобразуем в Date объект
      return new Date(val as string);
    },
    z.date().optional()
  )
});

export type CreateProviderData = z.infer<typeof createProviderSchema>;

// схема формы создания провайдера
export const createProviderSchema = z.object({
  // Данные провайдера
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

export type CreateServiceWithProviderData = z.infer<typeof createServiceWithProviderSchema>;

// схема формы создания сервиса+провайдер
export const createServiceWithProviderSchema = createServiceSchema.merge(createProviderSchema);