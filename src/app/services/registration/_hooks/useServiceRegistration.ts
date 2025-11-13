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

  const onSubmit = async (data: CreateServiceWithProviderData, photos?: PhotoItem[]) => {
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
      const responseData = await createServiceWithProvider(data, user.userId, photos);

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
