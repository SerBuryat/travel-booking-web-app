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
import { saveServicePhoto } from '@/lib/service/media';

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
    resolver: zodResolver(createServiceSchema)
  });

  const onSubmit = async (data: CreateServiceData, photos?: PhotoItem[]) => {
    if (!user) {
      setResult({
        success: false,
        message: 'Пользователь не аутентифицирован',
        error: 'Authentication required'
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      // Создаем сервис
      const responseData = await createService(data, user.providerId);

      // Сохраняем фото в S3 (если есть)
      if (photos && photos.length > 0) {
        try {
          // Сохраняем все фото параллельно
          await Promise.all(
            photos.map(photo => saveServicePhoto(responseData.serviceId, photo.file))
          );
          console.log('[useProvideCreateService] Успешно сохранено фото:', photos.length);
        } catch (photoError) {
          // Логируем ошибку, но не останавливаем процесс
          console.error('[useProvideCreateService] Ошибка при сохранении фото:', photoError);
        }
      }

      setResult({
        success: true,
        message: 'Сервис успешно создан! Теперь вы можете перейти в бизнес-аккаунт.',
        serviceId: responseData.serviceId
      });

      // Сброс формы при успехе
      form.reset();

    } catch (error) {
      console.error('Ошибка создания сервиса:', error);
      setResult({
        success: false,
        message: 'Произошла ошибка при создании сервиса',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
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
