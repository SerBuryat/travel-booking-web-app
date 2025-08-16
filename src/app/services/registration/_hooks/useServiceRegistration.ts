'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceRegistrationSchema, ServiceRegistrationFormData } from '@/schemas/serviceRegistrationSchema';
import { useAuth } from '@/contexts/AuthContext';

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

  const form = useForm<ServiceRegistrationFormData>({
    resolver: zodResolver(serviceRegistrationSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      tcategories_id: 0,
      address: '',
      tarea_id: 0,
      phone: '',
      tg_username: '',
      serviceOptions: [],
      // Новые поля провайдера
      providerCompanyName: '',
      providerContactPerson: '',
      providerPhone: ''
    }
  });

  const onSubmit = async (data: ServiceRegistrationFormData) => {
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
      const response = await fetch('/api/services/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          clientId: user.id // Передаем ID клиента
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Ошибка при создании сервиса');
      }

      setResult({
        success: true,
        message: 'Сервис успешно создан! Теперь вы можете перейти в бизнес-аккаунт.',
        serviceId: responseData.service.id
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
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    errors: form.formState.errors,
    result,
    resetResult
  };
};
