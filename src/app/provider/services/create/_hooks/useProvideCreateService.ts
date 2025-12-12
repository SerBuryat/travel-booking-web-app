'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  CreateServiceData, createServiceSchema
} from '@/schemas/service/createServiceSchema';
import {useAuth} from '@/contexts/AuthContext';
import {createService} from "@/lib/service/createService";
import { PhotoItem } from '@/lib/service/hooks/useServicePhotos';
import {log} from '@/lib/utils/logger';
import {generateTraceId} from '@/lib/utils/traceId';

export interface ServiceCreationResult {
  success: boolean;
  message: string;
  serviceId?: number;
  error?: string;
}

export const useProvideCreateService = () => {
  const [result, setResult] = useState<ServiceCreationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema),
    mode: 'onChange', // Валидация при изменении полей
    reValidateMode: 'onChange' // Перевалидация при изменении после первой валидации
  });

  const onSubmit = async (data: CreateServiceData, photos?: PhotoItem[], forceError?: boolean) => {
    // Генерируем traceId для отслеживания процесса
    const traceId = generateTraceId();

    if (!user) {
      log(
        'useProvideCreateService',
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

    if (!user.providerId) {
      log(
        'useProvideCreateService',
        'Попытка создания сервиса без providerId',
        'error',
        { userId: user.userId, serviceName: data.name },
        undefined,
        traceId
      );
      setResult({
        success: false,
        message: 'Провайдер не найден. Пожалуйста, сначала создайте провайдера.',
        error: 'Provider not found'
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    log(
      'useProvideCreateService',
      'Начало создания сервиса провайдером',
      'info',
      {
        userId: user.userId,
        providerId: user.providerId,
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

      // Создаем сервис
      const responseData = await createService(data, user.providerId, photos, traceId);

      log(
        'useProvideCreateService',
        'Сервис успешно создан провайдером',
        'info',
        {
          userId: user.userId,
          providerId: user.providerId,
          serviceId: responseData.serviceId,
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
        'useProvideCreateService',
        'Ошибка создания сервиса провайдером',
        'error',
        {
          userId: user.userId,
          providerId: user.providerId,
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
