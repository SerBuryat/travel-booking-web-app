'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  CreateServiceWithProviderData, createServiceWithProviderSchema
} from '@/schemas/service/createServiceSchema';
import {useAuth} from '@/contexts/AuthContext';
import {createServiceWithProvider} from "@/lib/service/createService";
import {PhotoItem} from "@/lib/service/hooks/useServicePhotos";
import {log} from '@/lib/utils/logger';
import {generateTraceId} from '@/lib/utils/traceId';

export interface ServiceCreationResult {
  success: boolean;
  message: string;
  serviceId?: number;
  error?: string;
}

export const useServiceRegistration = () => {
  const [result, setResult] = useState<ServiceCreationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<CreateServiceWithProviderData>({
    resolver: zodResolver(createServiceWithProviderSchema),
    mode: 'onChange', // Валидация при изменении полей
    reValidateMode: 'onChange' // Перевалидация при изменении после первой валидации
  });

  const onSubmit = async (data: CreateServiceWithProviderData, photos?: PhotoItem[], forceError?: boolean) => {
    // Генерируем traceId для отслеживания процесса
    const traceId = generateTraceId();

    if (!user) {
      log(
        'useServiceRegistration',
        'Попытка создания сервиса без аутентификации',
        'warn',
        { formData: { name: data.name, categoryId: data.tcategories_id } },
        undefined,
        traceId
      );
      setResult({
        success: false,
        message: 'Пользователь не аутентифицирован',
        error: 'Authentication required'
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    log(
      'useServiceRegistration',
      'Начало создания сервиса с провайдером',
      'info',
      {
        userId: user.userId,
        serviceName: data.name,
        categoryId: data.tcategories_id,
        areaId: data.tarea_id
      },
      undefined,
      traceId
    );

    try {
      // Принудительная ошибка для тестирования в development режиме
      if (forceError) {
        throw new Error('Тестовая ошибка: принудительное прерывание создания сервиса');
      }

      const responseData = await createServiceWithProvider(data, user.userId, photos, traceId);

      log(
        'useServiceRegistration',
        'Сервис успешно создан',
        'info',
        {
          userId: user.userId,
          serviceId: responseData.serviceId,
          providerId: responseData.providerId,
          serviceName: data.name
        },
        undefined,
        traceId
      );

      setResult({
        success: true,
        message: 'Сервис успешно создан! Теперь вы можете перейти в бизнес-аккаунт.',
        serviceId: responseData.serviceId
      });

      // Сброс формы при успехе
      form.reset();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      log(
        'useServiceRegistration',
        'Ошибка создания сервиса',
        'error',
        {
          userId: user.userId,
          serviceName: data.name,
          categoryId: data.tcategories_id,
          areaId: data.tarea_id
        },
        error,
        traceId
      );
      setResult({
        success: false,
        message: 'Произошла ошибка при создании сервиса',
        error: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    errors: form.formState.errors,
    result,
    resetResult
  };
};
