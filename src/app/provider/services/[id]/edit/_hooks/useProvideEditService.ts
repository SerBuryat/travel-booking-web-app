'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateServiceData,
  createServiceSchema,
} from '@/schemas/service/createServiceSchema';
import { useAuth } from '@/contexts/AuthContext';
import { updateService } from '@/lib/provider/servicesEdit';
import type { ServiceEditData, PhotoUpdateData } from '@/lib/provider/servicesEdit';
import {log} from '@/lib/utils/logger';
import {generateTraceId} from '@/lib/utils/traceId';

export interface ServiceUpdateResult {
  success: boolean;
  message: string;
  error?: string;
}

interface UseProvideEditServiceProps {
  serviceId: number;
  initialData: ServiceEditData;
}

export const useProvideEditService = ({ serviceId, initialData }: UseProvideEditServiceProps) => {
  const [result, setResult] = useState<ServiceUpdateResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema),
    mode: 'onChange', // Валидация при изменении полей
    reValidateMode: 'onChange', // Перевалидация при изменении после первой валидации
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      tcategories_id: initialData.tcategories_id,
      address: initialData.address,
      tarea_id: initialData.tarea_id,
      phone: initialData.phone || '',
      tg_username: initialData.tg_username || '',
      website: initialData.website || '',
      whatsap: initialData.whatsap || '',
      serviceOptions: initialData.serviceOptions || [],
    },
  });

  // Обновляем форму при изменении initialData
  useEffect(() => {
    form.reset({
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      tcategories_id: initialData.tcategories_id,
      address: initialData.address,
      tarea_id: initialData.tarea_id,
      phone: initialData.phone || '',
      tg_username: initialData.tg_username || '',
      website: initialData.website || '',
      whatsap: initialData.whatsap || '',
      serviceOptions: initialData.serviceOptions || [],
    });
  }, [initialData, form]);

  const onSubmit = async (data: CreateServiceData, photos?: PhotoUpdateData) => {
    // Генерируем traceId для отслеживания процесса
    const traceId = generateTraceId();

    if (!user) {
      log(
        'useProvideEditService',
        'Попытка обновления сервиса без аутентификации',
        'warn',
        { serviceId, formData: { name: data.name, categoryId: data.tcategories_id } },
        undefined,
        traceId
      );
      setResult({
        success: false,
        message: 'Пользователь не аутентифицирован',
        error: 'Authentication required',
      });
      return;
    }

    if (!user.providerId) {
      log(
        'useProvideEditService',
        'Попытка обновления сервиса без providerId',
        'error',
        { userId: user.userId, serviceId, serviceName: data.name },
        undefined,
        traceId
      );
      setResult({
        success: false,
        message: 'Провайдер не найден',
        error: 'Provider not found',
      });
      return;
    }

    if (!photos) {
      log(
        'useProvideEditService',
        'Попытка обновления сервиса без фото',
        'error',
        { userId: user.userId, providerId: user.providerId, serviceId, serviceName: data.name },
        undefined,
        traceId
      );
      setResult({
        success: false,
        message: 'Необходимо загрузить фотографии',
        error: 'Photos required',
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    log(
      'useProvideEditService',
      'Начало обновления сервиса',
      'info',
      {
        userId: user.userId,
        providerId: user.providerId,
        serviceId,
        serviceName: data.name,
        categoryId: data.tcategories_id,
        areaId: data.tarea_id
      },
      undefined,
      traceId
    );

    try {
      // Обновляем сервис
      await updateService(serviceId, data, photos, traceId);

      log(
        'useProvideEditService',
        'Сервис успешно обновлен',
        'info',
        {
          userId: user.userId,
          providerId: user.providerId,
          serviceId,
          serviceName: data.name
        },
        undefined,
        traceId
      );

      setResult({
        success: true,
        message: 'Сервис успешно обновлен!',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      log(
        'useProvideEditService',
        'Ошибка обновления сервиса',
        'error',
        {
          userId: user.userId,
          providerId: user.providerId,
          serviceId,
          serviceName: data.name,
          categoryId: data.tcategories_id,
          areaId: data.tarea_id
        },
        error,
        traceId
      );
      setResult({
        success: false,
        message: 'Произошла ошибка при обновлении сервиса',
        error: errorMessage,
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
    resetResult,
  };
};

