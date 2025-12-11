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
    if (!user) {
      log(
        'useProvideEditService',
        'Попытка обновления сервиса без аутентификации',
        'warn',
        { serviceId, formData: { name: data.name, categoryId: data.tcategories_id } }
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
        { userId: user.userId, serviceId, serviceName: data.name }
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
        { userId: user.userId, providerId: user.providerId, serviceId, serviceName: data.name }
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

    const existingPhotosCount = photos.existing?.length || 0;
    const newPhotosCount = photos.new?.length || 0;
    const totalNewPhotosSizeMB = photos.new
      ?.reduce((sum, p) => sum + (p.file?.size || 0), 0) / 1024 / 1024 || 0;

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
        areaId: data.tarea_id,
        existingPhotosCount,
        newPhotosCount,
        totalNewPhotosSizeMB: totalNewPhotosSizeMB.toFixed(2)
      }
    );

    try {
      // Обновляем сервис
      await updateService(serviceId, data, photos);

      log(
        'useProvideEditService',
        'Сервис успешно обновлен',
        'info',
        {
          userId: user.userId,
          providerId: user.providerId,
          serviceId,
          serviceName: data.name
        }
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
          areaId: data.tarea_id,
          existingPhotosCount,
          newPhotosCount,
          totalNewPhotosSizeMB: totalNewPhotosSizeMB.toFixed(2),
          formErrors: form.formState.errors
        },
        error
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

